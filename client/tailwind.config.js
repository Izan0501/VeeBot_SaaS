/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Tenant Brand Tokens ──────────────────────────────────────────────
        // These map to CSS vars injected by TenantProvider (useInsertionEffect).
        // Safe fallbacks prevent any flash of wrong color on first paint.
        brand: {
          DEFAULT:   'var(--color-primary, #0F172A)',
          secondary: 'var(--color-secondary, #3B82F6)',
          // Sidebar background: deep dark with a 12% brand tint.
          // color-mix blends the primary into near-black so the sidebar feels
          // branded without being garish. Fallback: pure near-black.
          surface:   'color-mix(in srgb, var(--color-primary, #0F172A) 12%, #080C14)',
          // Subtle border line between sidebar sections / dividers
          border:    'color-mix(in srgb, var(--color-primary, #0F172A) 20%, rgba(255,255,255,0.06))',
        },

        // ── Semantic aliases used in Sidebar / UI components ─────────────────
        // Allows classes like: bg-active, text-active-icon, ring-active
        active: 'var(--color-primary, #0F172A)',
      },
      // ── Box-shadow utilities using the brand color ────────────────────────
      boxShadow: {
        'brand-sm':  '0 0 12px color-mix(in srgb, var(--color-primary, #0F172A) 20%, transparent)',
        'brand-md':  '0 0 24px color-mix(in srgb, var(--color-primary, #0F172A) 30%, transparent)',
        'brand-glow':'0 0 40px color-mix(in srgb, var(--color-secondary, #3B82F6) 25%, transparent)',
      },
    },
  },
  plugins: [],
}