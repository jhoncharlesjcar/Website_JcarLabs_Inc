import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withUrlShim, URL_SHIM_MARKER } from './url-shim.js';

test('withUrlShim injects the subclass once', () => {
  const first = withUrlShim('<html><head></head><body></body></html>');
  const second = withUrlShim(first);
  assert.equal((second.match(new RegExp(URL_SHIM_MARKER, 'g')) || []).length, 1);
  assert.match(second, /class extends OriginalURL/);
});
