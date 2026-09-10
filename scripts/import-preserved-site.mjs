// One-time migration. Refuses to overwrite authored sources or the baseline.
import { readdir, readFile, writeFile, mkdir, cp, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const baselineFile = path.join(root, 'migration/baseline.json');
try { await access(baselineFile); throw new Error('Baseline already exists. Import is intentionally one-time.'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

async function files(directory) {
  const result = [];
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(relative));
    else result.push(relative);
  }
  return result.sort();
}
const pageFiles = ['index.html'];
for (const directory of ['404', 'contact', 'privacy-policy', 'services', 'terms-of-use', 'thoughts', 'work']) {
  pageFiles.push(...(await files(directory)).filter((file) => file.endsWith('.html')));
}
const assetFiles = [...await files('assets'), ...(await readdir(root)).filter((name) => /\.(css|js)$/.test(name)), 'robots.txt', 'sitemap.xml'];
const baseline = { pages: [], assets: [] };
const routes = [];
const hash = (data) => createHash('sha256').update(data).digest('hex');
for (const file of pageFiles.sort()) {
  const route = file === 'index.html' ? '/' : `/${file.replace(/\/index\.html$/, '')}`;
  const destination = path.join(root, 'src/content/pages', file);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(path.join(root, file), destination, { errorOnExist: true, force: false });
  const data = await readFile(destination);
  routes.push({ route, file });
  baseline.pages.push({ route, file, sha256: hash(data) });
}
for (const file of assetFiles.sort()) {
  const destination = path.join(root, 'public', file);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(path.join(root, file), destination, { errorOnExist: true, force: false });
  baseline.assets.push({ file, sha256: hash(await readFile(destination)) });
}
await mkdir(path.dirname(baselineFile), { recursive: true });
await writeFile(path.join(root, 'src/content/routes.json'), JSON.stringify(routes, null, 2) + '\n');
await writeFile(baselineFile, JSON.stringify(baseline, null, 2) + '\n');
console.log(`Preserved ${routes.length} pages and ${assetFiles.length} assets. Originals remain untouched.`);
