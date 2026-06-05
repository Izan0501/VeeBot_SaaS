import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 *
 * Resets the window scroll to the top on every pathname change — but ONLY
 * when there is no hash in the new URL. This prevents a race condition where:
 *
 *   1. User clicks Navbar link from a non-landing page → navigate(`/#pricing`)
 *   2. ScrollToTop fires window.scrollTo(0, 0)         ← ⚠️ race: page snaps to top
 *   3. useHashScroll (below) fires element.scrollIntoView() ← section scroll lost
 *
 * By skipping the scroll-reset when `hash` is present, we let useHashScroll
 * own the scroll position after cross-page hash navigation.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If the navigation target has a hash, skip resetting scroll to top.
    // useHashScroll handles the final scroll position in that case.
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;