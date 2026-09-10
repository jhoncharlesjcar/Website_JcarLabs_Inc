import { chromium } from '@playwright/test';
import config from '../playwright.config.mjs';
import fs from 'node:fs/promises';
const browser = await chromium.launch(config.use.launchOptions);
try {
  const page = await browser.newPage({ viewport: { width: 1459, height: 859 }, extraHTTPHeaders: { 'Accept-Encoding': 'identity' } });
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'load' });
  await page.waitForTimeout(15000);
  const state = await page.evaluate(() => {
    const section = document.querySelector('section[data-framer-name="Section 0 - Hero"]');
    function inspect(element, depth = 0) {
      const rect = element.getBoundingClientRect(), css = getComputedStyle(element);
      return { tag: element.tagName, class: element.className, name: element.getAttribute('data-framer-name'), text: element.children.length ? undefined : element.textContent, rect: { y: rect.y, height: rect.height, width: rect.width }, css: { height: css.height, minHeight: css.minHeight, maxHeight: css.maxHeight, flex: css.flex, display: css.display, overflow: css.overflow, position: css.position }, children: depth < 4 ? [...element.children].filter(el => el.tagName !== 'STYLE').map(el => inspect(el, depth + 1)) : [] };
    }
    return inspect(section);
  });
  await fs.writeFile('migration/reports/hero-height-before.json', JSON.stringify(state, null, 2));
  await page.screenshot({ path: 'migration/reports/hero-height-before.png' });
  console.log(JSON.stringify(state, null, 2));
} finally { await browser.close(); }
