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

## Phase 6 — User Management

`/admin/users` (searchable, filterable, paginated table with
activate/deactivate), `/admin/users/new`, `/admin/users/:id/edit`, and
`/admin/users/:id` (details + order history).

## Phase 7 — Seller System

`/become-a-seller` (any logged-in user, linked from the navbar unless
they're already a seller/admin) shows the application form, or the current
status + rejection reason if one exists, with a reapply option after
rejection. Admin gets `/admin/sellers` (filterable list) and
`/admin/sellers/:id` (full profile + approve/reject/suspend/activate
actions, reject requires a reason).

Note: approving a seller doesn't retroactively update that seller's own
already-loaded session - they'll see their new role after their next
`reloadUser()` call (e.g. next page load that hits `/me`).

## Phase 8 — Seller Dashboard

`/seller` (protected, `allowedRoles={['seller']}`) with its own sidebar
(`SellerLayout`, 11 modules). Dashboard and Store Profile are real; the
rest are `ComingSoon` placeholders naming their phase, same pattern as
admin. `StatCard` and `ComingSoon` were moved to `components/common/` so
both admin and seller dashboards share one copy instead of two.

## Phase 9 — Category, Subcategory & Brand Management

`/admin/categories`, `/admin/subcategories` (with a category dropdown
sourced from the categories list), and `/admin/brands` - each a
searchable/filterable table with Edit, Activate/Deactivate, and Delete,
plus a shared create/edit form page. Image/logo fields are plain URL text
inputs for now; real file upload comes with Phase 10's product images.

## Phase 10 — Product Management

`/seller/products` (list, searchable/filterable by status) and a shared
`/seller/products/new` \/ `/seller/products/:id/edit` form covering core
fields, image upload (multiple files), and dynamic variant rows
(SKU/size/color/stock) and spec-attribute rows (name/value), each with
add/remove buttons. `/admin/products` mirrors it read-only plus
approve/reject/toggle-active, matching the Sellers page pattern from
Phase 7.

## Common errors & fixes

| Error | Fix |
|---|---|
| Network error / CORS in console | Backend not running, or `FRONTEND_URL` in the backend `.env` doesn't match `http://localhost:5173` exactly. |
| `419` on login (added in Phase 2) | Call `ensureCsrfCookie()` before the POST — already done inside `authService.js`. |
