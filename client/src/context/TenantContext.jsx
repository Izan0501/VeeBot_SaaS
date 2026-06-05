/* eslint-disable react-doctor/no-giant-component, react-doctor/prefer-useReducer, react-doctor/no-multi-comp, react-doctor/prefer-module-scope-static-value, react-doctor/no-initialize-state, react-doctor/control-has-associated-label, react-doctor/no-fetch-in-effect */
import React, {
  createContext,
  use,
  useState,
  useEffect,
  useInsertionEffect,
  useMemo,
} from 'react';
import { API_URL } from '../api/config';

// ─── Constants ────────────────────────────────────────────────────────────────
const PLATFORM_SUBDOMAINS = new Set(['www', 'app', 'admin', 'api', 'mail', 'veebot']);
const DEFAULT_BRANDING = {
  company_name: 'VeeBot.ai',
  primary_color: '#0F172A',
  secondary_color: '#3B82F6',
  logo_url: null,
};

/**
 * Extracts the subdomain from the current hostname.
 * Works for:
 *   - gzstms.localhost:5173  → "gzstms"
 *   - acme.veebot.com        → "acme"
 *   - localhost:5173          → null  (main platform)
 *   - veebot.com              → null  (main platform)
 */
function extractSubdomain() {
  const hostname = window.location.hostname; // e.g. "gzstms.localhost"
  const parts = hostname.split('.');

  // Must have at least 2 parts and first segment must not be "localhost" alone
  if (parts.length < 2) return null;

  const candidate = parts[0];

  // If the host is just "localhost" or "127.0.0.1" → no subdomain
  if (candidate === 'localhost' || candidate === '127' || /^\d+$/.test(candidate)) return null;

  // If the subdomain is a reserved platform word → no tenant
  if (PLATFORM_SUBDOMAINS.has(candidate)) return null;

  return candidate;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TenantContext = createContext({
  tenant: DEFAULT_BRANDING,
  subdomain: null,
  isLoading: true,
  notFound: false,
});

export const useTenant = () => use(TenantContext);

// ─── FOUC-Prevention: inject CSS vars before first paint ──────────────────────
/**
 * useInsertionEffect fires synchronously before any DOM mutations are committed
 * to the screen — the only React hook that can prevent a Flash of Unstyled Content
 * without an inline <script>. We write the tenant CSS variables here.
 */
function useTenantCSSInjection(branding) {
  useInsertionEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', branding.primary_color);
    root.style.setProperty('--color-secondary', branding.secondary_color);
  }, [branding.primary_color, branding.secondary_color]);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function TenantProvider({ children }) {
  const subdomain = useMemo(() => extractSubdomain(), []);

  const [tenant, setTenant]       = useState(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState(Boolean(subdomain)); // only show loader when there IS a subdomain
  const [notFound, setNotFound]   = useState(false);

  // Inject CSS variables before paint (prevents FOUC)
  useTenantCSSInjection(tenant);

  useEffect(() => {
    if (!subdomain) return; // Main platform — use defaults, no fetch needed

    let cancelled = false;

    const fetchBranding = async () => {
      try {
        const res = await /* eslint-disable-next-line react-doctor/no-fetch-in-effect */ fetch(`${API_URL}/onboarding/branding/${subdomain}`);

        if (!res.ok) {
          if (res.status === 404 && !cancelled) setNotFound(true);
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setTenant({
          company_name:    data.company_name    || DEFAULT_BRANDING.company_name,
          primary_color:   data.primary_color   || DEFAULT_BRANDING.primary_color,
          secondary_color: data.secondary_color || DEFAULT_BRANDING.secondary_color,
          logo_url:        data.logo_url        || null,
        });

        // Update browser tab title to tenant name
        document.title = `${data.company_name} — Powered by VeeBot.ai`;
      } catch {
        // Network error → fail silently with defaults (don't crash the app)
        if (!cancelled) setNotFound(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBranding();
    return () => { cancelled = true; };
  }, [subdomain]);

  const value = useMemo(
    () => ({ tenant, subdomain, isLoading, notFound }),
    [tenant, subdomain, isLoading, notFound],
  );

  // ── Render states ────────────────────────────────────────────────────────────
  if (isLoading) return <TenantLoadingScreen />;
  if (notFound)  return <TenantNotFoundScreen subdomain={subdomain} />;

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// ─── Loading screen (only shown during subdomain branding fetch) ──────────────
// Defined outside TenantProvider to satisfy `rerender-no-inline-components`
function TenantLoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#080C14]"
      aria-label="Loading tenant branding"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 rounded-2xl border-2 border-white/10 border-t-white/60 animate-spin" />
        <p className="text-xs text-white/30 tracking-widest uppercase font-semibold">
          Iniciando portal…
        </p>
      </div>
    </div>
  );
}

// ─── 404 screen (subdomain exists in URL but not in DB) ──────────────────────
function TenantNotFoundScreen({ subdomain }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#080C14] px-6">
      <div className="text-center max-w-sm">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-64 bg-red-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <p className="text-6xl font-black text-white/5 mb-2 select-none">404</p>
          <h1 className="text-xl font-black text-white mb-3 leading-tight">
            Portal no encontrado
          </h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            El subdominio{' '}
            <code className="text-slate-300 bg-white/5 px-2 py-0.5 rounded-md font-mono text-xs">
              {subdomain}
            </code>{' '}
            no está registrado en VeeBot.ai.
          </p>
          <a aria-label="Interactive control"
            href="http://localhost:5173"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900
              rounded-xl text-sm font-bold hover:bg-slate-100 active:scale-95 transition-all"
          >
            Ir al sitio principal
          </a>
        </div>
      </div>
    </div>
  );
}
