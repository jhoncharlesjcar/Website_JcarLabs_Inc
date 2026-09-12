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

function walkJson(value, dict) {
  if (typeof value === 'string') return applyExactDictionary(applyLeaks(value), dict);
  if (Array.isArray(value)) return value.map((item) => walkJson(item, dict));
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = walkJson(value[key], dict);
  }
  return value;
}

export function applyCorporateHtml(html) {
  let result = applyLeaks(html);
  result = result.replace(/<html\b([^>]*\blang=")en(")/i, '<html$1es$2');
  result = result.replace(/<meta\b[^>]*name="generator"[^>]*>/i, '<meta name="generator" content="JCAR Labs Inc.">');

  const dict = dictionary();
  result = result.replace(/<(p|h1|h2|h3|h4|h5|h6|span|a|li|button|label|time|cite)(\b[^>]*)>([^<]*)<\/\1>/gi, (match, tag, attrs, text) => {
    const next = applyExactDictionary(text, dict);
    return next === text ? match : `<${tag}${attrs}>${next}</${tag}>`;
  });

  result = result.replace(/data-framer-hydrate-v2="([^"]*)"/g, (match, encoded) => {
    try {
      const json = JSON.parse(encoded.replaceAll('&quot;', '"'));
      return `data-framer-hydrate-v2="${JSON.stringify(walkJson(json, dict)).replaceAll('"', '&quot;')}"`;
    } catch {
      return `data-framer-hydrate-v2="${applyLeaks(encoded)}"`;
    }
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
