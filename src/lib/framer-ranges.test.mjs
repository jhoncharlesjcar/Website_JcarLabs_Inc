import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFramerRanges, MAX_FRAMER_RANGES, MAX_FRAMER_RANGE_BYTES } from './framer-ranges.mjs';

test('parses a single valid range', () => {
  assert.deepEqual(parseFramerRanges('0-99', 1000), [{ start: 0, end: 99 }]);
});

test('parses multiple ranges in order', () => {
  assert.deepEqual(parseFramerRanges('0-9,20-29', 100), [
    { start: 0, end: 9 },
    { start: 20, end: 29 },
  ]);
});

test('rejects empty or malformed input', () => {
  assert.equal(parseFramerRanges('', 100), null);
  assert.equal(parseFramerRanges('0-', 100), null);
  assert.equal(parseFramerRanges('bytes=0-9', 100), null);
});

test('rejects ranges past the file size', () => {
  assert.equal(parseFramerRanges('0-100', 100), null);
  assert.equal(parseFramerRanges('90-80', 100), null);
});

test('rejects more than MAX_FRAMER_RANGES slices', () => {
  const slices = Array.from({ length: MAX_FRAMER_RANGES + 1 }, () => '0-1').join(',');
  assert.equal(parseFramerRanges(slices, 1000), null);
});

test('rejects amplified concatenations over the byte cap', () => {
  const size = 1000;
  const repeats = Math.ceil(MAX_FRAMER_RANGE_BYTES / size) + 1;
  const slices = Array.from({ length: Math.min(repeats, MAX_FRAMER_RANGES) }, () => `0-${size - 1}`).join(',');
  assert.equal(parseFramerRanges(slices, size), null);
});
