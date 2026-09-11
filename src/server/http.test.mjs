import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createSiteServer } from './http.mjs';

test('production server 301s template URLs before serving files', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'jcar-site-'));
  await writeFile(path.join(dir, 'index.html'), '<html><head></head><body>home</body></html>');
  const server = createSiteServer({ rootDirectory: dir });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const checks = [
      ['/work/fragile-perfection', '/work'],
      ['/work/silent-gravity/', '/work'],
      ['/services/integraciones-sunat', '/services/auditoria-de-codigo'],
      ['/thoughts/anything', '/services'],
    ];
    for (const [pathName, location] of checks) {
      const response = await fetch(`http://127.0.0.1:${port}${pathName}`, { redirect: 'manual' });
      assert.equal(response.status, 301, pathName);
      assert.equal(response.headers.get('location'), location, pathName);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
