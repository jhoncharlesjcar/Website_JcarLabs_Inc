import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createSiteServer } from '../src/server/http.mjs';

let server, origin;
const rootDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
before(async () => {
  server = createSiteServer({ rootDirectory });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); });

test('every existing route and legacy redirect retains its response', async () => {
  const routes = JSON.parse(await readFile(new URL('../src/content/routes.json', import.meta.url)));
  const redirects = new Map([
    ['/work/unstable-sequence', '/work/sistema-hotelero'],
    ['/work/still-pressure', '/work/nezus-bisuteria'],
    ['/work/surface-tension', '/work/soluciones-empresariales'],
  ]);
  for (const { route } of routes) {
    const destination = route.startsWith('/thoughts') ? '/services' : redirects.get(route);
    const response = await fetch(origin + route, { redirect: 'manual' });
    assert.equal(response.status, destination ? 301 : 200, route);
    if (destination) assert.equal(response.headers.get('location'), destination);
    else assert.match(await response.text(), /data-framer-hydrate-v2/);
    await response.body?.cancel().catch(() => {});
  }
});
test('CMS concatenated query ranges retain exact binary content', async () => {
  const file = 'assets/cms/PuvR7bUan-indexes-default-0.framercms';
  const source = await readFile(new URL(`../dist/${file}`, import.meta.url));
  const response = await fetch(`${origin}/${file}?range=0-144,200-220`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-cache');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), Buffer.concat([source.subarray(0, 145), source.subarray(200, 221)]));
  assert.equal((await fetch(`${origin}/${file}?range=0-99999999`)).status, 416);
});
test('videos support ranges, HEAD and rejected invalid ranges', async () => {
  const url = `${origin}/assets/videos/video-video-1.mp4`;
  const response = await fetch(url, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(response.status, 206);
  assert.equal((await response.arrayBuffer()).byteLength, 1024);
  const head = await fetch(url, { method: 'HEAD', headers: { Range: 'bytes=0-1023' } });
  assert.equal(head.status, 206);
  assert.equal(head.headers.get('content-length'), '1024');
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  assert.equal((await fetch(url, { headers: { Range: 'bytes=invalid' } })).status, 416);
});
test('security, compression, caching, error page and URL compatibility survive', async () => {
  const response = await fetch(origin + '/');
  assert.ok(response.headers.get('content-security-policy'));
  assert.match(await response.text(), /const OriginalURL = window.URL/);
  const cached = await fetch(origin + '/', { headers: { 'If-None-Match': response.headers.get('etag') } });
  assert.equal(cached.status, 304);
  const css = await fetch(origin + '/styles.css', { headers: { 'Accept-Encoding': 'br' } });
  assert.equal(css.headers.get('content-encoding'), 'br');
  await css.body.cancel();
  const missing = await fetch(origin + '/missing-migration-page');
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get('cache-control'), 'no-cache');
  assert.match(await missing.text(), /<html/);
  assert.equal((await fetch(origin + '/%E0%A4%A')).status, 400);
  assert.equal((await fetch(origin + '/package.json')).status, 404);
});
