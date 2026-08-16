import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Jumps to the top of the page whenever the route changes.
 *
 * React Router doesn't reset scroll on navigation, so without this you keep
 * the previous page's scroll offset — e.g. browsing halfway down Phones and
 * clicking Tablets drops you into the middle of a different list.
 */
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // `scroll-behavior: smooth` is set globally for the "back to top"
    // button, but animating a route change looks like the page is sliding
    // around, so it's turned off for this jump only.
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previousBehavior;
  }, [pathname]);
}
