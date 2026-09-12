// Injected into built HTML so relative `new URL('/x')` resolves against location.
// Returns native URL instances so Framer's CMS fetch and instanceof checks work.
export const URL_SHIM_MARKER = 'data-jcar-url-shim';

export const urlShimScript = `<script ${URL_SHIM_MARKER}>
(function () {
  var OriginalURL = window.URL;
  function PatchedURL(url, base) {
    if (base === undefined && typeof url === 'string') {
      try { return new OriginalURL(url); }
      catch (error) { return new OriginalURL(url, window.location.href); }
    }
    return base === undefined ? new OriginalURL(url) : new OriginalURL(url, base);
  }
  PatchedURL.prototype = OriginalURL.prototype;
  Object.setPrototypeOf(PatchedURL, OriginalURL);
  ['createObjectURL', 'revokeObjectURL', 'canParse', 'parse'].forEach(function (name) {
    if (typeof OriginalURL[name] === 'function') PatchedURL[name] = OriginalURL[name].bind(OriginalURL);
  });
  window.URL = PatchedURL;
})();
</script>`;

export function withUrlShim(html) {
  if (!html || html.includes(URL_SHIM_MARKER)) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1>${urlShimScript}`);
}
