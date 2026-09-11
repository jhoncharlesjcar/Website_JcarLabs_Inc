import { defineMiddleware } from 'astro:middleware';
import { withUrlShim } from './lib/url-shim.js';
import { legacyRedirectTarget } from './lib/legacy-redirects.mjs';

// The production server already provides these transport behaviours. Astro dev
// needs the same URL compatibility and redirects, without altering build HTML.
export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV) return next();
  const target = legacyRedirectTarget(context.url.pathname);
  if (target) return context.redirect(target, 301);
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = withUrlShim(await response.text());
  return new Response(html, { status: response.status, headers: response.headers });
});
