import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import config from '../playwright.config.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.SITE_URL || 'http://127.0.0.1:4321';
const browser = await chromium.launch(config.use.launchOptions);
const results = [];
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, extraHTTPHeaders: { 'Accept-Encoding': 'identity' } });
    // Capture the existing WhatsApp handoff without opening or sending anything.
    await page.addInitScript(() => { window.__openedURLs = []; window.open = (url) => { window.__openedURLs.push(url); return null; }; });
    await page.goto(origin + '/contact', { waitUntil: 'domcontentloaded' });
    await page.locator('form[data-jcar-configured="true"]').waitFor({ timeout: 20000 });
    await page.locator('input[name="Name"]').fill('Prueba de migración');
    await page.locator('input[name="Email"]').fill('qa@example.com');
    await page.locator('textarea[name="Message"]').fill('Verificación local sin envío');
    await page.locator('button[type="submit"]').click();
    const opened = await page.evaluate(() => window.__openedURLs);
    assert.equal(opened.length, 1);
    const target = new URL(opened[0]);
    assert.equal(target.origin + target.pathname, 'https://wa.me/51904615337');
    assert.match(target.searchParams.get('text'), /Prueba de migración.*qa@example.com.*Verificación local sin envío/);
    console.log(`PASS: ${width}px WhatsApp form handoff (intercepted).`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    if (width === 390) await page.locator('nav .framer-u8umlp').click();
    const destination = width === 390 ? '/services' : '/work';
    await page.locator(`nav a[href="${destination}"], nav a[href=".${destination}"]`).first().click();
    console.log(`Navigation ${width}px: ${page.url()}`);
    await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === destination, { waitUntil: 'domcontentloaded' }).catch((error) => { throw new Error(`Navigation at ${width}px ended at ${page.url()}; expected ${destination}`, { cause: error }); });
    assert.equal(new URL(page.url()).pathname.replace(/\/$/, ''), destination);
    results.push({ width, whatsappHandoff: 'passed (intercepted, not sent)', navigation: 'passed', destination });
    await page.close();
  }
  await mkdir(new URL('../migration/reports/', import.meta.url), { recursive: true });
  await writeFile(new URL('../migration/reports/interactions.json', import.meta.url), JSON.stringify({ origin, results }, null, 2));
  console.log('PASS: WhatsApp form handoff and navigation at 390px and 1440px. No messages sent.');
} catch (error) { console.error(error); process.exitCode = 1; }
finally { await browser.close(); }
