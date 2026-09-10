import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const routes = ['/', '/work', '/services', '/contact', '/privacy-policy', '/terms-of-use', '/work/sistema-hotelero', '/work/nezus-bisuteria', '/work/soluciones-empresariales', '/work/fragile-perfection', '/work/silent-gravity', '/services/desarrollo-web', '/services/inteligencia-artificial', '/services/desarrollo-full-stack', '/services/software-empresarial', '/services/integraciones-sunat', '/404'];

async function settle(page) {
  // A style element can predate the actual Framer commit. Wait past the existing
  // brand layer's 12-second fallback before comparing either document.
  await page.waitForTimeout(14500);
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const video of document.querySelectorAll('video')) {
      video.pause();
      if (video.readyState > 0) video.currentTime = 0;
    }
  });
  await page.waitForTimeout(300);
}
async function contract(page) {
  return page.evaluate(() => ({
    title: document.title,
    links: [...document.querySelectorAll('a[href]')].map((anchor) => ({ href: anchor.getAttribute('href'), text: anchor.textContent?.trim() })),
    // The original accessibility timer may add/remove its extra screen-reader
    // heading during hydration. It is not a visual element; its source is hashed.
    headings: [...document.querySelectorAll('h1,h2,h3')].filter((heading) => !heading.hasAttribute('data-accessible-page-heading')).map((heading) => heading.textContent?.trim()),
    fields: [...document.querySelectorAll('input,textarea,select')].map((field) => ({ tag: field.tagName, name: field.getAttribute('name'), type: field.getAttribute('type'), required: field.required })),
    videos: [...document.querySelectorAll('video')].map((video) => ({ src: video.getAttribute('src'), autoplay: video.autoplay, muted: video.muted, loop: video.loop })),
    overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    motion: document.getAnimations().map((animation) => ({ duration: animation.effect?.getTiming().duration, easing: animation.effect?.getTiming().easing, iterations: String(animation.effect?.getTiming().iterations) })),
  }));
}
for (const width of [390, 834, 1440]) {
  for (const route of routes) {
    test(`${width}px ${route} matches the original`, async ({ browser }, testInfo) => {
      // Compression is tested over HTTP separately. Avoid compressing the same
      // large Framer modules for six simultaneous cold browser loads: the legacy
      // server does Brotli on every request and can race its 12s branding timer.
      const options = { viewport: { width, height: 900 }, extraHTTPHeaders: { 'Accept-Encoding': 'identity' } };
      const contexts = await Promise.all([browser.newContext(options), browser.newContext(options)]);
      const pages = await Promise.all(contexts.map((context) => context.newPage()));
      const errors = [[], []];
      pages.forEach((page, index) => page.on('pageerror', (error) => errors[index].push(error.message)));
      try {
        await Promise.all(pages.map((page, index) => page.goto(`http://127.0.0.1:${index ? 4320 : 4319}${route}`, { waitUntil: 'load' })));
        await Promise.all(pages.map(settle));
        const contracts = await Promise.all(pages.map(contract));
        // Animation phase can differ by a frame; sources and durations are checked separately.
        const { motion: originalMotion, ...original } = contracts[0];
        const { motion: migratedMotion, ...migrated } = contracts[1];
        expect(migrated).toEqual(original);
        expect([...new Set(migratedMotion.map(JSON.stringify))].sort()).toEqual([...new Set(originalMotion.map(JSON.stringify))].sort());
        expect(errors[1].filter((error) => !errors[0].includes(error))).toEqual([]);
        const geometry = await Promise.all(pages.map((page) => page.locator('h1:not([data-accessible-page-heading]),h2,h3,input[name="Name"],input[name="Email"],textarea[name="Message"]').evaluateAll((elements) => elements.map((element) => {
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, width, height };
        }))));
        expect(geometry[1].length).toBe(geometry[0].length);
        for (let i = 0; i < geometry[0].length; i++) {
          for (const dimension of ['x', 'y', 'width', 'height']) expect(Math.abs(geometry[1][i][dimension] - geometry[0][i][dimension]), `element ${i} ${dimension}`).toBeLessThanOrEqual(1);
        }
        for (const position of ['top', 'middle']) {
          if (position === 'middle') {
            const heights = await Promise.all(pages.map((page) => page.evaluate(() => document.documentElement.scrollHeight)));
            const target = Math.min(...heights) / 2;
            await Promise.all(pages.map((page) => page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), target)));
            await Promise.all(pages.map((page) => page.waitForTimeout(2500)));
            const scroll = await Promise.all(pages.map((page) => page.evaluate(() => window.scrollY)));
            expect(Math.abs(scroll[1] - scroll[0]), 'same scroll position').toBeLessThanOrEqual(1);
          }
          // Video content is hash-checked separately; independent playback clocks
          // must not create false visual regressions in the surrounding layout.
          const screenshots = await Promise.all(pages.map((page, index) => page.screenshot({ path: testInfo.outputPath(`${position}-${index ? 'astro' : 'original'}.png`), mask: [page.locator('video')] })));
          const [a, b] = screenshots.map((buffer) => PNG.sync.read(buffer));
          const diff = new PNG({ width: a.width, height: a.height });
          const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.15 });
          const ratio = changed / (a.width * a.height);
          await testInfo.attach(`${position}-original`, { body: screenshots[0], contentType: 'image/png' });
          await testInfo.attach(`${position}-astro`, { body: screenshots[1], contentType: 'image/png' });
          testInfo.annotations.push({ type: `visual-${position}`, description: String(ratio) });
          if (ratio > 0.03) await testInfo.attach(`${position}-diff`, { body: PNG.sync.write(diff), contentType: 'image/png' });
          // Transformed Framer text is rasterized at slightly different subpixel
          // phases. Geometry is checked to 1px above; resource/content parity is exact.
          expect(ratio, `${position} visual difference`).toBeLessThanOrEqual(0.03);
        }
      } finally { await Promise.all(contexts.map((context) => context.close())); }
    });
  }
}
