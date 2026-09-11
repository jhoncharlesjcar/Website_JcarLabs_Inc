import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corporateDocument } from './corporate-document.mjs';
import { site } from '../content/corporate.mjs';

const homeSource = `<!DOCTYPE html><html><head>
<title>Old</title>
<meta name="description" content="old">
<meta property="og:title" content="old">
<meta property="og:description" content="old">
<meta property="og:url" content="https://vertical.framer.media/">
<meta property="og:image" content="https://vertical.framer.media/assets/images/image-extra-4.jpg">
<link rel="canonical" href="https://vertical.framer.media/">
<meta name="framer-search-index" content="https://framerusercontent.com/x.json">
<script id="site-structured-data" type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Old","url":"https://vertical.framer.media/"}</script>
</head><body></body></html>`;

test('home document uses origin without a trailing slash on inner routes and replaces Framer URLs', () => {
  const result = corporateDocument(homeSource, '/');
  assert.match(result, new RegExp(`<link rel="canonical" href="${site.origin}">`));
  assert.match(result, new RegExp(`property="og:url" content="${site.origin}"`));
  assert.doesNotMatch(result, /vertical\.framer\.media/);
  assert.doesNotMatch(result, /framer-search-index/);
  assert.match(result, new RegExp(`"url":"${site.origin}"`));
  assert.match(result, /hero-image-6\.jpg/);
});

test('contact canonical has no trailing slash', () => {
  const source = `<html><head><title>Contact</title><link rel="canonical" href="https://vertical.framer.media/contact"><meta property="og:url" content="https://vertical.framer.media/contact"></head><body></body></html>`;
  const result = corporateDocument(source, '/contact');
  assert.match(result, new RegExp(`href="${site.origin}/contact"`));
  assert.doesNotMatch(result, new RegExp(`${site.origin}/contact/`));
});

test('invalid JSON-LD does not throw', () => {
  const source = `<html><head><title>x</title><script type="application/ld+json">{not json}</script></head><body></body></html>`;
  assert.doesNotThrow(() => corporateDocument(source, '/'));
});

test('URL shim is injected once even if corporateDocument runs twice', () => {
  const once = corporateDocument(homeSource, '/');
  const twice = corporateDocument(once, '/');
  const matches = twice.match(/data-jcar-url-shim/g) || [];
  assert.equal(matches.length, 1);
  assert.match(twice, /class extends OriginalURL/);
});

test('404 also receives the URL shim', () => {
  const result = corporateDocument('<html><head></head><body></body></html>', '/404');
  assert.match(result, /data-jcar-url-shim/);
});
