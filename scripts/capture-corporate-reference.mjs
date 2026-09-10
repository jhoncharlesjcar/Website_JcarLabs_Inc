import { chromium } from '@playwright/test';
import config from '../playwright.config.mjs';
import fs from 'node:fs/promises';

const browser = await chromium.launch(config.use.launchOptions);
const routes = ['/', '/services', '/services/desarrollo-web', '/services/inteligencia-artificial', '/services/desarrollo-full-stack', '/services/software-empresarial', '/services/integraciones-sunat', '/contact'];
const result = {};
await fs.mkdir('migration/corporate-reference', { recursive: true });
try {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, extraHTTPHeaders: { 'Accept-Encoding': 'identity' } });
    await page.goto(`http://127.0.0.1:4321${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(15000);
    result[route] = await page.evaluate(() => ({
      title: document.title,
      sections: [...document.querySelectorAll('main section')].map((el) => ({ name: el.getAttribute('data-framer-name'), class: el.className })),
      blocks: [...document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main h5, main h6, main li')].map((el) => ({ tag: el.tagName, text: el.textContent.trim(), html: el.innerHTML, class: el.className, name: el.closest('[data-framer-name]')?.getAttribute('data-framer-name') })).filter((el) => el.text),
      links: [...document.querySelectorAll('a[href]')].map((el) => el.getAttribute('href')),
    }));
    await fs.writeFile('migration/corporate-reference/content.json', JSON.stringify(result, null, 2));
    await page.screenshot({ path: `migration/corporate-reference/${route.replaceAll('/', '_') || 'home'}.png`, mask: [page.locator('video')] });
    console.log(route, result[route].blocks.length, 'blocks');
    await page.close();
  }
} finally { await browser.close(); }
