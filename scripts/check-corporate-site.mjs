import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import config from '../playwright.config.mjs';
import fs from 'node:fs/promises';
import { site, services } from '../src/content/corporate.mjs';

const origin = process.env.SITE_URL || 'http://127.0.0.1:4321';
const reference = JSON.parse(await fs.readFile('migration/corporate-reference/content.json', 'utf8'));
const sourceBlocks = JSON.parse(await fs.readFile('src/content/service-source-blocks.json', 'utf8'));
const translations = Object.fromEntries(services.map((service) => [service.route, sourceBlocks[service.route].map((source, index) => [source, service.article[index]])]));
const normalize = (text) => text.replace(/\s+/g, ' ').trim().toUpperCase();
const browser = await chromium.launch(config.use.launchOptions);
const report = process.env.CORPORATE_MERGE_REPORT === '1' ? JSON.parse(await fs.readFile('migration/reports/corporate-results.json', 'utf8')) : [];
const widths = process.env.CORPORATE_WIDTHS?.split(',').map(Number) || [390, 834, 1440];
const routes = process.env.CORPORATE_ROUTES?.split(',') || Object.keys(reference);
await fs.mkdir('migration/reports/corporate', { recursive: true });
try {
  for (const width of widths) for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, extraHTTPHeaders: { 'Accept-Encoding': 'identity' } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(origin + route, { waitUntil: 'load' });
    await page.waitForTimeout(15000);
    const current = await page.evaluate(() => ({
      title: document.title,
      text: document.querySelector('main').textContent,
      sections: [...document.querySelectorAll('main section')].map((el) => ({ name: el.getAttribute('data-framer-name'), class: el.className })),
      blocks: [...document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main h5, main h6, main li')].map((el) => ({ tag: el.tagName, class: el.className, text: el.textContent.trim(), html: el.innerHTML })).filter((el) => el.text && el.class !== 'sr-only'),
      links: [...document.querySelectorAll('a[href]')].map((el) => el.getAttribute('href')),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      overflow: document.documentElement.scrollWidth - innerWidth,
      highlights: document.querySelectorAll('.jcar-highlight').length,
      about: document.getElementById('about-me')?.textContent,
      animations: document.querySelectorAll('[data-framer-appear-id]').length,
    }));
    const failures = [];
    const check = (name, fn) => { try { fn(); } catch (error) { failures.push(name + ': ' + error.message); } };
    check('HTTP', () => assert.equal(response.status(), 200));
    check('overflow', () => assert.ok(current.overflow <= 1, `${current.overflow}px`));
    check('domain pending', () => assert.ok(!current.canonical));
    check('sections', () => assert.deepEqual(current.sections, reference[route].sections));
    const originalBlocks = reference[route].blocks.filter((el) => el.class !== 'sr-only');
    // The captured editorial reference is desktop; Framer intentionally uses
    // different text elements and presets in its mobile/tablet variants.
    if (width === 1440) check('editorial elements', () => assert.deepEqual(current.blocks.map(({ tag, class: className }) => [tag, className]), originalBlocks.map(({ tag, class: className }) => [tag, className])));
    if (width === 1440) check('links', () => assert.deepEqual(current.links, reference[route].links));
    const service = services.find((item) => item.route === route);
    if (service) {
      check('service title', () => assert.equal(current.title, `${service.title} — ${site.name}`));
      for (const [before, after] of translations[route]) {
        check('translated article', () => assert.ok(normalize(current.text).includes(normalize(after)), after.slice(0, 60)));
        check('original article removed', () => assert.ok(!normalize(current.text).includes(normalize(before)), before.slice(0, 60)));
      }
    }
    if (route === '/services') for (const service of services) {
      check('listing ' + service.route, () => assert.ok(current.links.includes(service.route) && normalize(current.text).includes(service.label)));
    }
    if (route === '/') {
      check('brand title', () => assert.equal(current.title, site.title));
      // The retained tablet variant uses H5 blocks; the original emphasis
      // effect targets P blocks on phone/desktop only.
      check('highlight effects', () => assert.equal(current.highlights, width === 834 ? 0 : 6));
      for (const technology of site.technologies) check('technology ' + technology, () => assert.ok(normalize(current.text).includes(normalize(technology))));
    }
    await page.screenshot({ path: `migration/reports/corporate/${width}${route.replaceAll('/', '_')}.png`, mask: [page.locator('video')] });
    const result = { width, route, passed: failures.length === 0, failures, errors, title: current.title, overflow: current.overflow, animations: current.animations };
    const previous = report.findIndex((item) => item.width === width && item.route === route);
    if (previous >= 0) report[previous] = result;
    else report.push(result);
    await fs.writeFile('migration/reports/corporate-results.json', JSON.stringify(report, null, 2));
    await fs.writeFile(`migration/reports/corporate/${width}${route.replaceAll('/', '_')}.json`, JSON.stringify(current, null, 2));
    console.log(`${result.passed ? 'PASS' : 'FAIL'} ${width}px ${route}`);
    if (failures.length) console.log(failures.join('\n').slice(0, 3500));
    await page.close();
  }
} finally { await browser.close(); }
if (report.some(({ passed }) => !passed)) process.exitCode = 1;
