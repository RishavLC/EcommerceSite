# Marketplace Frontend — Phase 1

React + Vite + React Router + Axios + Tailwind + Context API.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
# http://localhost:5173
```

Requires the Laravel backend running at `http://127.0.0.1:8000`
(`php artisan serve`). The Home page pings `/api/v1/ping` to confirm the
frontend/backend wiring works end-to-end.

## Structure

- `src/services/api.js` — shared Axios instance (`withCredentials: true` for
  Sanctum cookie auth) + `ensureCsrfCookie()` helper
- `src/context/AuthContext.jsx` — Context API auth state, shaped so it can
  be swapped for a Redux slice later without touching consumers
- `src/components/common/ProtectedRoute.jsx` — role-gated route wrapper,
  used from Phase 5 onward
- `src/routes/AppRoutes.jsx` — single place new routes get added per phase

## Phase 2 — Authentication

Added `/login`, `/register`, `/forgot-password`, `/reset-password` pages,
plus a fully wired `AuthContext` (`login`, `register`, `logout`,
`reloadUser`) backed by `services/authService.js`. The Navbar now shows
"Hi, {name}" + Logout when signed in, or Login/Register when not.

Try it: register a user, log in, refresh the page (session persists via
Sanctum's cookie), then log out.

## Phase 5 — Admin Dashboard

Added `/admin` (protected, `allowedRoles={['admin']}`) with a sidebar
(`AdminLayout`) linking to all 15 admin modules. Only Dashboard is real
right now - it shows 10 stat cards plus 6 recharts (daily/monthly sales,
top products, top sellers, category performance, new users). The other
links render a shared `ComingSoon` placeholder naming which phase builds
them. Routing was refactored to nested `<Outlet />` layouts so admin gets
its own sidebar shell instead of the storefront navbar/footer.

Verified with a real `npm install && npm run build` - compiles clean.

## Common errors & fixes

| Error | Fix |
|---|---|
| Network error / CORS in console | Backend not running, or `FRONTEND_URL` in the backend `.env` doesn't match `http://localhost:5173` exactly. |
| `419` on login (added in Phase 2) | Call `ensureCsrfCookie()` before the POST — already done inside `authService.js`. |
