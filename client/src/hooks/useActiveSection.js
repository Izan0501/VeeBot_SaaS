import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useActiveSection
 *
 * Tracks the active nav section and scroll position using only
 * IntersectionObserver — zero raw scroll event listeners, zero
 * getBoundingClientRect() calls during scroll.
 *
 * @param {string[]} sectionIds  - Array of element IDs to observe (no leading '#')
 * @param {number}   navbarHeight - Navbar height in px (used as rootMargin offset)
 */
export function useActiveSection(sectionIds, navbarHeight = 80) {
  const [activeId, setActiveId]       = useState(null);
  const [isScrolled, setIsScrolled]   = useState(false);

  // Suspension flag to prevent layout thrashing during programmatic scroll
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);

  const setManualActiveId = useCallback((id) => {
    isProgrammaticScroll.current = true;
    setActiveId(id);
    if (activeIdRef) activeIdRef.current = id;
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    // Suspend intersection updates for 1 second (scroll duration)
    scrollTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 1000);
  }, []);

  // Stable ref so callbacks never stale-close over old state
  const activeIdRef   = useRef(null);
  const sectionObsRef = useRef(null);
  const sentinelObsRef = useRef(null);
  const sentinelRef   = useRef(null);

  // ─── 1. Sentinel IO for isScrolled (replaces raw scroll listener) ───────
  useEffect(() => {
    // A zero-height sentinel pinned to top:0 — when it leaves the viewport
    // (user has scrolled down >0px) the observer fires.
    const sentinel = document.createElement('div');
    sentinel.style.cssText =
      'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    sentinelRef.current = sentinel;

    sentinelObsRef.current = new IntersectionObserver(
      ([entry]) => {
        // isScrolled = sentinel is NOT intersecting (scrolled below top)
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    sentinelObsRef.current.observe(sentinel);

    return () => {
      sentinelObsRef.current?.disconnect();
      sentinel.remove();
    };
  }, []);

  // ─── 2. Section IO for active link tracking ──────────────────────────────
  // Stable callback — never re-created, never triggers dependency loops
  const handleIntersect = useCallback((entries) => {
    if (isProgrammaticScroll.current) return;

    // With a "-50% 0px -50% 0px" rootMargin, the observer fires precisely
    // when a section's edge crosses the exact center of the viewport.
    // Only one section can occupy the center line at any moment, so we
    // take the first intersecting entry directly — no reduce needed.
    const intersecting = entries.filter((e) => e.isIntersecting);
    if (intersecting.length === 0) return;

    const newId = intersecting[0].target.id;
    if (newId !== activeIdRef.current) {
      activeIdRef.current = newId;
      setActiveId(newId);
    }
  }, []);

  useEffect(() => {
    if (sectionObsRef.current) sectionObsRef.current.disconnect();

    sectionObsRef.current = new IntersectionObserver(handleIntersect, {
      // "Center Screen Laser": creates a 0-height horizontal band at the
      // exact vertical center of the viewport. A section activates the moment
      // its body crosses this line — symmetrical in both scroll directions,
      // preventing the activeId from ever getting "stuck" mid-scroll.
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObsRef.current.observe(el);
    });

    return () => sectionObsRef.current?.disconnect();

    // Stringify to avoid referential inequality on each render
  }, [sectionIds, navbarHeight, handleIntersect]);

  return { activeId, isScrolled, setManualActiveId };
}
