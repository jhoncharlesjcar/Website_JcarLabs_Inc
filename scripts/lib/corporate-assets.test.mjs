import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sitemap, robots } from './corporate-assets.mjs';
import { site } from '../../src/content/corporate.mjs';

test('robots.txt points at the origin sitemap', () => {
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, new RegExp(`Sitemap: ${site.origin}/sitemap.xml`));
});

test('sitemap lists origin URLs without a trailing slash', () => {
  assert.match(sitemap, new RegExp(`<loc>${site.origin}</loc>`));
  assert.match(sitemap, new RegExp(`<loc>${site.origin}/contact</loc>`));
  assert.match(sitemap, new RegExp(`<loc>${site.origin}/services/auditoria-de-codigo</loc>`));
  assert.doesNotMatch(sitemap, new RegExp(`<loc>${site.origin}/contact/</loc>`));
  assert.equal([...sitemap.matchAll(/<url>/g)].length, 14);
});

test('service 05 listing copy is auditoría, not SUNAT billing', async () => {
  const source = await readFile(new URL('../../src/content/brand-content.base.js', import.meta.url), 'utf8');
  const card = source.match(/number: "05"[\s\S]*?href: "\/services\/auditoria-de-codigo"[\s\S]*?\}/);
  assert.ok(card, 'service 05 listing card is present');
  assert.match(card[0], /AUDITORÍA DE CÓDIGO/);
  assert.doesNotMatch(card[0], /SUNAT/);
  assert.doesNotMatch(card[0], /[Ff]acturación/);
});
