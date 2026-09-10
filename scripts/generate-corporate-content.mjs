import fs from 'node:fs/promises';
import { createBrandScript, robots, sitemap } from './lib/corporate-assets.mjs';
const [original, translations, runtime] = await Promise.all([
  fs.readFile(new URL('../src/content/brand-content.base.js', import.meta.url), 'utf8'),
  fs.readFile(new URL('../src/content/service-source-blocks.json', import.meta.url), 'utf8'),
  fs.readFile(new URL('../src/lib/corporate-runtime.js', import.meta.url), 'utf8'),
]);
await fs.writeFile(new URL('../public/brand-content.js', import.meta.url), createBrandScript(original, JSON.parse(translations), runtime));
await fs.writeFile(new URL('../public/robots.txt', import.meta.url), robots);
await fs.writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap);
console.log('Corporate content generated; assets generated in public/.');
