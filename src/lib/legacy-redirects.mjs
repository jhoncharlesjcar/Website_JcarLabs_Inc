export const LEGACY_REDIRECTS = new Map([
  ['/thoughts', '/services'],
  ['/work/unstable-sequence', '/work/sistema-hotelero'],
  ['/work/still-pressure', '/work/nezus-bisuteria'],
  ['/work/surface-tension', '/work/soluciones-empresariales'],
  ['/work/fragile-perfection', '/work'],
  ['/work/silent-gravity', '/work'],
  ['/services/integraciones-sunat', '/services/auditoria-de-codigo'],
]);

export const LEGACY_PREFIXES = [{ prefix: '/thoughts/', target: '/services' }];

export function legacyRedirectTarget(pathname) {
  const normalized = (pathname || '/').replace(/\/$/, '') || '/';
  if (LEGACY_REDIRECTS.has(normalized)) return LEGACY_REDIRECTS.get(normalized);
  for (const { prefix, target } of LEGACY_PREFIXES) {
    if (normalized.startsWith(prefix)) return target;
  }
  return null;
}
