import { chromium } from '@playwright/test';
import config from '../playwright.config.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch(config.use.launchOptions);
const origin = process.env.SITE_URL || 'http://127.0.0.1:4321';
const results = [];
try {
  for (const [width, route, text] of [[1440, '/', 'ECOSISTEMA TECNOLÓGICO'], [1440, '/services', 'SISTEMAS LEGACY'], [390, '/services/desarrollo-full-stack', 'Servicios con límites claros']]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, extraHTTPHeaders: { 'Accept-Encoding': 'identity' } });
    await page.goto(origin + route, { waitUntil: 'load' });
    await page.waitForTimeout(15000);
    const locator = page.getByText(text, { exact: true }).first();
    await locator.evaluate((element) => {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 160, behavior: 'instant' });
    });
    await page.waitForTimeout(2500);
    const state = await locator.evaluate((element) => {
      let opacity = 1;
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) opacity *= Number(getComputedStyle(ancestor).opacity);
      const rect = element.getBoundingClientRect();
      return { opacity, top: rect.top, bottom: rect.bottom, width: rect.width, scrollY };
    });
    assert.ok(state.opacity > 0.9, `Scroll reveal hidden: ${text}`);
    assert.ok(state.top >= 0 && state.top < 900, `Target outside viewport: ${text}`);
    await page.screenshot({ path: `migration/reports/corporate/scroll-${width}${route.replaceAll('/', '_')}.png`, mask: [page.locator('video')] });
    results.push({ width, route, text, ...state, passed: true });
    console.log('PASS scroll reveal', width, route, text);
    await page.close();
  }
  await fs.writeFile('migration/reports/corporate-scroll.json', JSON.stringify(results, null, 2));
} finally { await browser.close(); }
