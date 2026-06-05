import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useHashScroll
 *
 * Handles programmatic scroll to a hash-targeted section after cross-page
 * navigation. Needed because React Router v7 with BrowserRouter does NOT
 * natively scroll to hash targets — it only updates the URL.
 *
 * Flow when a user clicks a Navbar link from a non-landing page:
 *   1. handleScrollTo calls navigate('/#pricing')
 *   2. React Router renders LandingPage
 *   3. useHashScroll fires after the render settles
 *   4. element.scrollIntoView() scrolls to the section smoothly
 *
 * Scroll behaviour is handled by the native browser compositor via CSS
 * `scroll-smooth` on <html> and `scroll-padding-top` on :root — no JS
 * scroll libraries, no frame-dropping animation.
 *
 * Usage: call this hook once inside App or a layout component that is
 * always mounted (e.g., alongside <ScrollToTop />).
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // The target element may not yet be painted when this effect runs
    // immediately after navigation — use requestAnimationFrame to wait
    // for the first paint of the new route before scrolling.
    const sectionId = hash.replace('#', '');

    let rafId;
    let attempts = 0;
    const MAX_ATTEMPTS = 10; // ~160ms at 60fps — enough for any section to paint

    const tryScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        // behavior:'smooth' is fully independent of CSS scroll-smooth on <html>.
        // scroll-smooth only applies to native anchor clicks (<a aria-label="Interactive control" href="#id">),
        // not imperative scrollIntoView() calls — they do not compete.
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Section not yet in DOM (still rendering) — retry next frame
      if (attempts < MAX_ATTEMPTS) {
        attempts++;
        rafId = requestAnimationFrame(tryScroll);
      }
    };

    rafId = requestAnimationFrame(tryScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [pathname, hash]);
}
