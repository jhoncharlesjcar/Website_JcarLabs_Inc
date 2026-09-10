import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Vercel includes dist/assets/cms/** at bundle time (see vercel.json → functions.includeFiles).
// __dirname points to /var/task/api/ in the Vercel Lambda environment.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cmsDir = path.resolve(__dirname, '..', 'dist', 'assets', 'cms');

const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
};

/**
 * Validates and parses the Framer-specific multi-range query parameter.
 * Format: "start-end[,start-end,...]" — byte offsets, zero-indexed.
 * Multiple ranges are concatenated in order into a single response body.
 *
 * @param {string} value  The raw ?range= query-string value.
 * @param {number} size   Total byte length of the file.
 * @returns {{ start: number, end: number }[] | null}
 */
function parseFramerRanges(value, size) {
  if (!value) return null;
  const ranges = value.split(',').map((part) => {
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
  return ranges.every(Boolean) ? ranges : null;
}

/**
 * Vercel serverless function — Framer CMS binary range protocol handler.
 *
 * Framer's runtime requests .framercms files with a custom ?range= query param
 * (e.g. ?range=0-1023,2048-4095) instead of the standard HTTP Range header.
 * This protocol cannot be served by a plain static CDN.
 *
 * Routing: vercel.json rewrites /assets/cms/:file → /api/framercms?file=:file
 * Vercel appends the original query string, so ?range= is automatically forwarded.
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse}  res
 */
export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const file = url.searchParams.get('file');
  const range = url.searchParams.get('range');

  // ── Validate filename ─────────────────────────────────────────────────────
  if (
    !file ||
    !file.endsWith('.framercms') ||
    file.includes('..') ||
    file.includes('/') ||
    file.includes('\\')
  ) {
    res.writeHead(400, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('400 Bad Request');
    return;
  }

  const filePath = path.join(cmsDir, file);

  // Secondary path-traversal guard after join
  if (!filePath.startsWith(cmsDir + path.sep) && filePath !== cmsDir) {
    res.writeHead(403, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('403 Forbidden');
    return;
  }

  try {
    const source = await readFile(filePath);

    // ── No range param → return the full file ────────────────────────────────
    if (!range) {
      res.writeHead(200, {
        ...SECURITY_HEADERS,
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'no-cache',
        'Content-Length': String(source.length),
      });
      res.end(req.method === 'HEAD' ? undefined : source);
      return;
    }

    // ── Parse the Framer multi-range format ──────────────────────────────────
    const ranges = parseFramerRanges(range, source.length);
    if (!ranges) {
      res.writeHead(416, {
        ...SECURITY_HEADERS,
        'Content-Range': `bytes */${source.length}`,
      });
      res.end();
      return;
    }

    // Concatenate all requested byte slices in order into a single buffer
    const body = Buffer.concat(
      ranges.map(({ start, end }) => source.subarray(start, end + 1))
    );

    res.writeHead(200, {
      ...SECURITY_HEADERS,
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Content-Length': String(body.length),
    });
    res.end(req.method === 'HEAD' ? undefined : body);

  } catch (err) {
    if (err.code === 'ENOENT') {
      res.writeHead(404, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
    } else {
      console.error('[framercms]', err);
      res.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('500 Internal Server Error');
    }
  }
}
