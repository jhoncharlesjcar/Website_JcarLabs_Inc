import { chromium } from '@playwright/test';
import config from '../playwright.config.mjs';
import { createSiteServer } from '../src/server/http.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

// Read-only control against the preserved export, including its existing
// responsive differences and browser errors. Never serves generated public/.
const server = createSiteServer({ rootDirectory: process.cwd() });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(config.use.launchOptions);
const report = [];
try {
  for (const [width, route] of [[390, '/'], [834, '/'], [1440, '/services/desarrollo-web']]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, extraHTTPHeaders: { 'Accept-Encoding': 'identity' } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(origin + route, { waitUntil: 'load' });
    await page.waitForTimeout(15000);
    const state = await page.evaluate(() => ({
      highlights: document.querySelectorAll('.jcar-highlight').length,
      appearMarkers: document.querySelectorAll('[data-framer-appear-id]').length,
      activeAnimations: document.getAnimations().filter((animation) => animation.playState === 'running').map((animation) => animation.animationName || animation.constructor.name).sort(),
    }));
    report.push({ width, route, errors, ...state });
    console.log('Original runtime control', width, route, JSON.stringify(state));
    await page.close();
  }
  await fs.writeFile(path.resolve('migration/corporate-reference/runtime.json'), JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
