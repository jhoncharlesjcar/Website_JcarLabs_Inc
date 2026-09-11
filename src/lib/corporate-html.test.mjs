import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCorporateHtml, BRAND_LEAK_PATTERNS } from './corporate-html.mjs';
import { corporateDocument } from './corporate-document.mjs';
import { site } from '../content/corporate.mjs';

const leaky = `<!DOCTYPE html><html lang="en"><head>
<meta name="generator" content="Framer e1541bb">
<title>Vertical</title>
</head><body>
<p>Adam Knoxville</p>
<p>hey@adamknoxville.design</p>
<p>(44) 7700 900 482</p>
<p>© 2026 VERTICAL BY ADAM KNOXVILLE. ALL WORK, ALL RIGHTS.</p>
<p>Fragile Perfection</p>
<p>Silent Gravity</p>
<a href="https://vertical.framer.media/contact">x</a>
<div data-framer-hydrate-v2="{&quot;title&quot;:&quot;Adam Knoxville&quot;,&quot;url&quot;:&quot;https://vertical.framer.media/&quot;}"></div>
</body></html>`;

test('build HTML strips template brand leaks', () => {
  const result = applyCorporateHtml(leaky);
  for (const pattern of BRAND_LEAK_PATTERNS) {
    assert.doesNotMatch(result, pattern, String(pattern));
  }
  assert.match(result, /lang="es"/);
  assert.match(result, /content="JCAR Labs Inc."/);
  assert.match(result, new RegExp(site.origin));
  assert.match(result, /contacto@jcarlabs.com/);
});

test('corporateDocument output for home has no Framer origin', () => {
  const result = corporateDocument(leaky, '/');
  assert.doesNotMatch(result, /vertical\.framer\.media/);
  assert.doesNotMatch(result, /Adam Knoxville/i);
  assert.match(result, /data-jcar-url-shim/);
});
