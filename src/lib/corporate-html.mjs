import { site, sharedCopy, extraCopy } from '../content/corporate.mjs';

const normalized = (value) => String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();

const LEAK_PAIRS = [
  ['© 2026 VERTICAL BY ADAM KNOXVILLE. ALL WORK, ALL RIGHTS.', '© 2026 JCAR LABS INC. TODOS LOS DERECHOS RESERVADOS.'],
  ['ADAM KNOXVILLE / VERTICAL', 'JCAR Labs Inc.'],
  ['hey@adamknoxville.design', 'contacto@jcarlabs.com'],
  ['HEY@ADAMKNOXVILLE.DESIGN', 'CONTACTO@JCARLABS.COM'],
  ['(44) 7700 900 482', '+51 904 615 337'],
  ['Fragile Perfection', 'Sistema Hotelero'],
  ['Silent Gravity', 'Nezus Bisutería'],
  ['Adam Knoxville', 'JCAR Labs Inc.'],
  ['VERTICAL BY', 'JCAR LABS INC. —'],
];

function dictionary() {
  const map = new Map();
  for (const [from, to] of Object.entries(sharedCopy)) map.set(normalized(from), to);
  for (const [from, to] of Object.entries(extraCopy)) map.set(normalized(from), to);
  return map;
}

function applyLeaks(text) {
  let result = text;
  if (site.origin) result = result.replaceAll('https://vertical.framer.media', site.origin);
  for (const [from, to] of LEAK_PAIRS) result = result.replaceAll(from, to);
  return result;
}

function applyExactDictionary(text, dict) {
  const key = normalized(text);
  if (!dict.has(key)) return text;
  const leading = text.match(/^\s*/)[0];
  const trailing = text.match(/\s*$/)[0];
  return leading + dict.get(key) + trailing;
}

function mapOutsideScripts(html, fn) {
  return html.split(/(<script\b[^>]*>[\s\S]*?<\/script>)/i).map((part) => (
    /^<script/i.test(part) ? part : fn(part)
  )).join('');
}

export function applyCorporateHtml(html) {
  let result = html.replace(/<html\b([^>]*\blang=")en(")/i, '<html$1es$2');
  result = result.replace(/<meta\b[^>]*name="generator"[^>]*>/i, '<meta name="generator" content="JCAR Labs Inc.">');

  const dict = dictionary();
  result = mapOutsideScripts(result, (chunk) => {
    let next = applyLeaks(chunk);
    next = next.replace(/<(p|h1|h2|h3|h4|h5|h6|span|a|li|button|label|time|cite)(\b[^>]*)>([^<]*)<\/\1>/gi, (match, tag, attrs, text) => {
      const replaced = applyExactDictionary(text, dict);
      return replaced === text ? match : `<${tag}${attrs}>${replaced}</${tag}>`;
    });
    next = next.replace(/data-framer-hydrate-v2="([^"]*)"/g, (_, encoded) => (
      `data-framer-hydrate-v2="${applyLeaks(encoded)}"`
    ));
    return next;
  });

  return result;
}

export const BRAND_LEAK_PATTERNS = [
  /Adam Knoxville/i,
  /VERTICAL BY/i,
  /vertical\.framer\.media/i,
  /hey@adamknoxville/i,
  /\(44\) 7700 900 482/,
  /Fragile Perfection/,
  /Silent Gravity/,
];
