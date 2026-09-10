// One-time authoring aid: pair each retained editorial block with its new copy.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { services } from '../src/content/corporate.mjs';
const reference = JSON.parse(await fs.readFile('migration/corporate-reference/content.json', 'utf8'));
const translations = {};
for (const service of services) {
  const blocks = reference[service.route].blocks;
  const end = blocks.findIndex(({ text }) => text === 'Thanks for reading');
  const article = blocks.slice(8, end);
  assert.equal(article.length, service.article.length, service.route);
  translations[service.route] = article.map(({ text }) => text);
}
await fs.writeFile('src/content/service-source-blocks.json', JSON.stringify(translations, null, 2) + '\n', { flag: 'wx' });
