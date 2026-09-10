import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { corporateDocument } from '../src/lib/corporate-document.mjs';
import { createBrandScript, robots, sitemap } from './lib/corporate-assets.mjs';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root));
const baseline = JSON.parse(await read('migration/baseline.json'));
const routes = JSON.parse(await read('src/content/routes.json'));
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
function documentParts(buffer) {
  const source = buffer.toString();
  const document = parse(source, { sourceCodeLocationInfo: true });
  const html = document.childNodes.find((node) => node.tagName === 'html');
  const result = { html: html.attrs };
  for (const tag of ['head', 'body']) {
    const node = html.childNodes.find((child) => child.tagName === tag);
    const location = node.sourceCodeLocation;
    result[tag] = { attrs: node.attrs, content: source.slice(location.startTag.endOffset, location.endTag.startOffset) };
  }
  return result;
}
assert.deepEqual(routes, baseline.pages.map(({ route, file }) => ({ route, file })), 'The route map changed');
for (const { file, route, sha256 } of baseline.pages) {
  assert.equal(hash(await read(file)), sha256, `Original modified: ${file}`);
  const authored = await read(`src/content/pages/${file}`);
  assert.equal(hash(authored), sha256, `Export changed: ${route}`);
  const output = route === '/404' ? '404.html' : file;
  const expected = corporateDocument(authored.toString(), route);
  assert.deepEqual(documentParts(await read(`dist/${output}`)), documentParts(expected), `Rendered DOM or script order changed outside approved metadata: ${route}`);
}
const corporateAssets = {
  'brand-content.js': createBrandScript((await read('brand-content.js')).toString(), JSON.parse(await read('src/content/service-source-blocks.json')), (await read('src/lib/corporate-runtime.js')).toString()),
  'robots.txt': robots,
  'sitemap.xml': sitemap,
};
for (const { file, sha256 } of baseline.assets) {
  for (const prefix of ['', 'public/', 'dist/']) {
    const expected = prefix && file in corporateAssets ? hash(corporateAssets[file]) : sha256;
    assert.equal(hash(await read(`${prefix}${file}`)), expected, `Resource changed: ${prefix}${file}`);
  }
}
assert.equal(hash(await read('dist/hero-adjustments.css')), hash(await read('public/hero-adjustments.css')), 'Requested hero height correction missing from build');
console.log(`PASS: ${baseline.pages.length} original exports remain intact; rendered documents differ only by approved corporate metadata.`);
console.log(`PASS: ${baseline.assets.length - Object.keys(corporateAssets).length} visual/runtime resources remain byte-identical; 3 content/SEO files match their deterministic generators.`);
