import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LEGACY_REDIRECTS, legacyRedirectTarget } from './legacy-redirects.mjs';
import routes from '../content/routes.json' with { type: 'json' };

test('legacyRedirectTarget maps art and SUNAT slugs', () => {
  assert.equal(legacyRedirectTarget('/work/fragile-perfection/'), '/work');
  assert.equal(legacyRedirectTarget('/work/silent-gravity'), '/work');
  assert.equal(legacyRedirectTarget('/thoughts/any-article'), '/services');
  assert.equal(legacyRedirectTarget('/services/integraciones-sunat'), '/services/auditoria-de-codigo');
  assert.equal(legacyRedirectTarget('/work'), null);
});

test('vercel.json lists every exact legacy redirect', async () => {
  const vercel = JSON.parse(await readFile(new URL('../../vercel.json', import.meta.url), 'utf8'));
  const pairs = new Set((vercel.redirects || []).map((row) => `${row.source}=>${row.destination}`));
  for (const [from, to] of LEGACY_REDIRECTS) {
    assert.ok(pairs.has(`${from}=>${to}`), `vercel.json missing ${from} => ${to}`);
  }
});

test('redirected template routes are not in the published manifest', () => {
  const published = new Set(routes.map((row) => row.route));
  for (const dead of [
    '/work/still-pressure',
    '/work/surface-tension',
    '/work/unstable-sequence',
    '/work/fragile-perfection',
    '/work/silent-gravity',
    '/thoughts',
    '/services/integraciones-sunat',
  ]) {
    assert.equal(published.has(dead), false, `${dead} should not be generated`);
  }
  assert.ok(published.has('/services/auditoria-de-codigo'));
  assert.ok(published.has('/work/sistema-hotelero'));
});
