import { defineMiddleware } from 'astro:middleware';

const redirects = new Map([
  ['/thoughts', '/services'],
  ['/work/unstable-sequence', '/work/sistema-hotelero'],
  ['/work/still-pressure', '/work/nezus-bisuteria'],
  ['/work/surface-tension', '/work/soluciones-empresariales'],
]);

// The production server already provides these transport behaviours. Astro dev
// needs the same URL compatibility and redirects, without altering build HTML.
export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV) return next();
  const pathname = context.url.pathname;
  const target = redirects.get(pathname) || (pathname.startsWith('/thoughts/') ? '/services' : undefined);
  if (target) return context.redirect(target, 301);
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const shim = `<script>
const OriginalURL = window.URL;
window.URL = function(url, base) {
  try { return new OriginalURL(url, base); }
  catch(e) {
    if (!base && typeof url === 'string') {
      try { return new OriginalURL(url, window.location.href); } catch(err) {}
    }
    throw e;
  }
};
Object.defineProperty(window.URL, 'createObjectURL', { value: OriginalURL.createObjectURL });
Object.defineProperty(window.URL, 'revokeObjectURL', { value: OriginalURL.revokeObjectURL });
</script>`;
  const html = (await response.text()).replace(/<head>/i, '<head>' + shim);
  return new Response(html, { status: response.status, headers: response.headers });
});
