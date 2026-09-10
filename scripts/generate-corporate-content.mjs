import fs from 'node:fs/promises';
import { createBrandScript, robots, sitemap } from './lib/corporate-assets.mjs';
const [original, translations, runtime] = await Promise.all([
  fs.readFile('brand-content.js', 'utf8'), fs.readFile('src/content/service-source-blocks.json', 'utf8'), fs.readFile('src/lib/corporate-runtime.js', 'utf8'),
]);
await fs.writeFile('public/brand-content.js', createBrandScript(original, JSON.parse(translations), runtime));
await fs.writeFile('public/robots.txt', robots);
await fs.writeFile('public/sitemap.xml', sitemap);
console.log('Corporate content generated; original exports and visual resources retained.');
