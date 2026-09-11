// Injected into built HTML so Vercel static output matches Astro dev / pnpm start.
export const URL_SHIM_MARKER = 'data-jcar-url-shim';

export const urlShimScript = `<script ${URL_SHIM_MARKER}>
const OriginalURL = window.URL;
window.URL = class extends OriginalURL {
  constructor(url, base) {
    if (base === undefined && typeof url === 'string') {
      try { new OriginalURL(url); }
      catch { base = window.location.href; }
    }
    if (base === undefined) super(url);
    else super(url, base);
  }
};
</script>`;

export function withUrlShim(html) {
  if (!html || html.includes(URL_SHIM_MARKER)) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1>${urlShimScript}`);
}
