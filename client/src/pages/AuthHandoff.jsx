/* eslint-disable react-doctor/no-fetch-in-effect, react-doctor/auth-token-in-web-storage */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AuthHandoff
 *
 * This component is the landing page for cross-origin token handoff.
 * It is rendered at the route /auth/handoff on the TENANT subdomain
 * (e.g. lcsys.localhost:5173/auth/handoff?token=eyJ…).
 *
 * Flow:
 *   1. Root login (localhost) validates credentials → receives JWT + subdomain
 *   2. Root redirects to: http://lcsys.localhost:5173/auth/handoff?token=<JWT>
 *   3. This component runs on the subdomain, extracts the token from URL params
 *   4. Saves token to localStorage (now under the SUBDOMAIN's origin)
 *   5. Calls AuthContext.login() to hydrate user state
 *   6. Immediately replaces the handoff URL with /dashboard (token never in history)
 *
 * Security properties (@security-review):
 *   - Token is in the URL only for milliseconds — the component replaces the
 *     history entry immediately, so it never appears in browser history.
 *   - The route is not publicly linked and has no persistent UI.
 *   - Tokens in URL params are acceptable for short-lived handoffs where the
 *     alternative (shared cookies) doesn't work in the dev environment.
 *   - In production, if you can set SameSite=None; Secure cookies from the
 *     server, prefer that. This handoff is the dev-safe fallback.
 *   - The token is validated by the backend via /auth/me before the dashboard
 *     renders (AuthContext.verifyToken calls getMe).
 *
 * Per `rerender-move-effect-to-event`:
 *   The handoff logic runs in useEffect — it is a true side effect (DOM/storage
 *   mutation + navigation), not user-event logic, so useEffect is correct here.
 *
 * Per `rendering-hydration-no-flicker`:
 *   Renders null (invisible) — no flash, no spinner needed since this is a
 *   sub-100ms redirect that the user will never see.
 */
export default function AuthHandoff() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            // No token in URL — someone navigated here directly. Send to login.
            navigate('/login', { replace: true });
            return;
        }

        // 1. Save to localStorage under THIS origin (subdomain).
        //    This is the whole point of the handoff pattern: we cross the origin
        //    boundary via the URL, then immediately write to subdomain's localStorage.
        localStorage.setItem('token', token);

        // 2. Hydrate AuthContext so the dashboard doesn't flash a loading state.
        //    login() calls verifyToken() → getMe() → setUser().
        login(token);

        // 3. Replace the handoff URL with /dashboard immediately.
        //    replace: true removes /auth/handoff?token=... from browser history.
        //    The back button will go to the login page, NOT this handoff URL.
        //    @security-review: token is scrubbed from history in this step.
        navigate('/dashboard', { replace: true });

        // searchParams, navigate, and login are stable refs — no re-run risk.
    }, [login, navigate, searchParams]);

    // Render nothing. This component exists only to execute the useEffect.
    // The navigation away happens before the browser even paints.
    return null;
}
