export const MAX_FRAMER_RANGES = 32;
export const MAX_FRAMER_RANGE_BYTES = 2_000_000;

/**
 * Framer CMS multi-range query: "start-end[,start-end,...]".
 * Rejects traversal-sized or amplified concatenations.
 *
 * @param {string | null} value
 * @param {number} size
 * @returns {{ start: number, end: number }[] | null}
 */
export function parseFramerRanges(value, size) {
  if (!value) return null;
  const parts = value.split(',');
  if (parts.length > MAX_FRAMER_RANGES) return null;
  const ranges = parts.map((part) => {
    const match = /^(\d+)-(\d+)$/.exec(part.trim());
    if (!match) return null;
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      start > end ||
      end >= size
    ) return null;
    return { start, end };
  });
  if (!ranges.every(Boolean)) return null;
  const total = ranges.reduce((sum, { start, end }) => sum + (end - start + 1), 0);
  if (total > Math.min(size, MAX_FRAMER_RANGE_BYTES)) return null;
  return ranges;
}
