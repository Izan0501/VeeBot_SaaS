/* eslint-disable react-doctor/auth-token-in-web-storage */
/**
 * utils/domain.js
 *
 * Canonical utility for all cross-origin / multi-tenant URL and session
 * operations. The single source of truth for domain logic — no other file
 * should do hostname math inline.
 *
 * Exports:
 *   getRootOrigin()           → "http://localhost:5173"
 *   getTenantOrigin(sub)      → "http://sub.localhost:5173"
 *   saveSessionCookie(token)  → writes JWT as cross-domain cookie
 *   clearSession()            → wipes storage + cookies
 *   logoutAndRedirect()       → clearSession() + hard redirect to root
 */

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * _parts()
 * Returns the hostname split by "." and the port string (with colon prefix).
 * Centralised so getRootOrigin / getTenantOrigin share the same parsing logic.
 *
 * @returns {{ protocol: string, parts: string[], portSuffix: string }}
 */
function _parts() {
  const { protocol, hostname, port } = window.location;
  return {
    protocol,
    parts: hostname.split('.'),
    portSuffix: port ? `:${port}` : '',
  };
}

/**
 * _rootHostname(parts)
 * Strips the first (leftmost) segment when the hostname has more than one part.
 *
 * "lcsys.localhost"    → "localhost"
 * "acme.veebot.com"   → "veebot.com"
 * "localhost"          → "localhost"     (no-op — already root)
 * "veebot.com"         → "veebot.com"   (no-op — already root)
 *
 * @param {string[]} parts
 * @returns {string}
 */
function _rootHostname(parts) {
  return parts.length > 1 ? parts.slice(1).join('.') : parts[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getRootOrigin()
 *
 * Returns the fully-qualified origin of the platform root — no subdomain.
 *
 * Dev:   lcsys.localhost:5173   →  "http://localhost:5173"
 * Prod:  acme.veebot.com        →  "https://veebot.com"
 * Root:  localhost:5173         →  "http://localhost:5173"  (no-op)
 *
 * @returns {string}
 */
function getRootOrigin() {
  const { protocol, parts, portSuffix } = _parts();
  return `${protocol}//${_rootHostname(parts)}${portSuffix}`;
}

/**
 * getTenantOrigin(subdomain)
 *
 * Builds a fully-qualified origin for a specific tenant subdomain.
 * Always resolves relative to the ROOT domain — so it works whether the
 * caller is already on a subdomain or on the root.
 *
 * Examples
 * ────────
 * Dev (called from localhost OR lcsys.localhost):
 *   getTenantOrigin("sysloco")  →  "http://sysloco.localhost:5173"
 *   getTenantOrigin("gzstms")   →  "http://gzstms.localhost:5173"
 *
 * Prod (called from veebot.com OR acme.veebot.com):
 *   getTenantOrigin("acme")     →  "https://acme.veebot.com"
 *
 * @param {string} subdomain  — the tenant slug (e.g. "sysloco")
 * @returns {string}          — absolute origin (no trailing slash)
 */
export function getTenantOrigin(subdomain) {
  if (!subdomain || typeof subdomain !== 'string') {
    console.warn('[domain] getTenantOrigin called with empty subdomain — falling back to root');
    return getRootOrigin();
  }
  const { protocol, parts, portSuffix } = _parts();
  const root = _rootHostname(parts);
  return `${protocol}//${subdomain.toLowerCase()}.${root}${portSuffix}`;
}

/**
 * saveSessionCookie(token)
 *
 * Persists the JWT in a cross-domain cookie so it survives the navigation
 * from root → tenant subdomain (or vice versa).
 *
 * Why cookie instead of localStorage?
 *   localStorage is scoped per origin. "localhost" and "sysloco.localhost"
 *   are different origins — localStorage written on one is not readable on
 *   the other. A cookie with domain=localhost (dev) or domain=.veebot.com
 *   (prod) is shared across all subdomains.
 *
 * Security notes:
 *   - SameSite=Lax: allows the cookie after top-level navigations (GET),
 *     blocks cross-site CSRF (POST). Correct for our redirect pattern.
 *   - HttpOnly is NOT set here (JS-managed cookie) because the client reads
 *     the token for Authorization headers. If you move to server-side auth,
 *     set HttpOnly on the FastAPI response cookie instead.
 *   - Max-Age=86400: 24 hours — matches the JWT expiry. Adjust to match
 *     your create_access_token EXPIRE_MINUTES setting in security.py.
 *   - Secure is set only in production (https:) to avoid dev friction.
 *
 * @param {string} token  — raw JWT string from the backend
 */
function saveSessionCookie(token) {
  if (!token) return;

  const { protocol, parts } = _parts();
  const rootHostname = _rootHostname(parts);

  // In production the cookie domain must start with "." to cover subdomains.
  // In dev (localhost) the dot prefix is ignored by browsers — just use the bare hostname.
  const isProduction = protocol === 'https:';
  const cookieDomain = isProduction ? `.${rootHostname}` : rootHostname;
  const secureFlag   = isProduction ? '; Secure' : '';

  document.cookie = [
    `token=${encodeURIComponent(token)}`,
    `Max-Age=86400`,        // 24 h — sync with JWT expiry in security.py
    `Path=/`,
    `Domain=${cookieDomain}`,
    `SameSite=Lax`,
    secureFlag,
  ].filter(Boolean).join('; ');

  // Also write to localStorage for same-origin reads (AuthContext.verifyToken)
  localStorage.setItem('token', token);
}

/**
 * clearSession()
 *
 * Purges all storage mechanisms used for authentication — call this BEFORE
 * any redirect so the destination page loads with a clean slate.
 */
function clearSession() {
  // 1. localStorage + sessionStorage
  const AUTH_KEYS = ['token', 'user', 'tenant', 'refresh_token'];
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // 2. Expire all auth-looking cookies on current domain AND root domain
  const { parts } = _parts();
  const rootHostname = _rootHostname(parts);

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name || !/token|session|auth/i.test(name)) return;

    // Expire on current path (handles both root and subdomain contexts)
    document.cookie = `${name}=; Max-Age=0; Path=/`;

    // Expire on root domain with leading dot (covers all subdomains in prod)
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${rootHostname}`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${rootHostname}`;
  });
}

/**
 * logoutAndRedirect()
 *
 * Canonical logout: clear all session data, then hard-redirect to the root
 * platform origin, escaping any subdomain context.
 *
 * Uses window.location.replace() so the current URL is removed from the
 * browser history — the back button will not return to the dashboard.
 */
export function logoutAndRedirect() {
  clearSession();
  window.location.replace(getRootOrigin());
}
