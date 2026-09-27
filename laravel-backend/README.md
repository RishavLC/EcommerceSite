# Marketplace API (Laravel Backend) — Phase 1

Foundation setup for the multi-vendor marketplace backend. Auth, roles,
products, orders etc. are **not** implemented yet — this phase only wires up
the project so later phases can build on solid ground.

## What's included

- Laravel 11 app skeleton (`bootstrap/app.php` uses the new single-file
  bootstrap style — no `Kernel.php`)
- MySQL configured as the default DB connection (`config/database.php`)
- Laravel Sanctum installed and configured for **SPA cookie auth**
  (`config/sanctum.php`, `statefulApi()` in `bootstrap/app.php`), with the
  `personal_access_tokens` table also migrated so mobile/3rd-party clients
  can use bearer tokens later
- CORS configured to allow the React dev server with credentials
  (`config/cors.php`)
- `ForceJsonResponse` middleware + `shouldRenderJsonWhen` so the API never
  returns Laravel's HTML error pages
- Role & seller-approval middleware **stubs** (`role:*`, `seller.approved`)
  wired into the route groups — they deny by default until Phase 3/7 build
  the real logic
- A scalable controller/service/repository folder structure under `app/`,
  split by role (`Admin`, `Seller`, `Buyer`, `Auth`)
- `routes/api.php` → versioned under `/api/v1`, split into
  `routes/api/{auth,admin,seller,buyer}.php` so each phase edits its own file

## Requirements

- PHP >= 8.2, with the `pdo_mysql`, `mbstring`, `fileinfo` extensions
- Composer 2.x
- MySQL 8.x (or MariaDB 10.6+)
- Node.js 18+ (only needed if you also run Vite asset building from here —
  not required, since the frontend is a separate app)

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate

# Create the database (adjust user/pass to match your MySQL setup)
mysql -u root -p -e "CREATE DATABASE marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Point .env at it, then:
php artisan migrate

# Sanctum's stateful-domain / SPA middleware is already wired in
# bootstrap/app.php via statefulApi() — no extra artisan command needed.

php artisan serve
# API now reachable at http://127.0.0.1:8000
```

## Verifying Phase 1

```bash
curl http://127.0.0.1:8000/api/v1/ping
```

Expected response:

```json
{
  "success": true,
  "message": "Marketplace API is reachable.",
  "timestamp": "2026-..."
}
```

If you get a CORS error from the browser console instead, double check
`FRONTEND_URL` in `.env` matches the exact origin (scheme + host + port) the
React app is running on.

## Common errors & fixes

| Error | Fix |
|---|---|
| `SQLSTATE[HY000] [1049] Unknown database 'marketplace'` | Create the DB first (see above) — Laravel doesn't create it for you. |
| `Class "PDO" not found` | Enable `pdo_mysql` in your `php.ini`. |
| `419 CSRF token mismatch` when calling from React | You're using cookie-based Sanctum auth without first hitting `/sanctum/csrf-cookie`, or `SESSION_DOMAIN`/`SANCTUM_STATEFUL_DOMAINS` don't match the frontend's actual host. |
| CORS blocked in browser | Check `FRONTEND_URL` in `.env` and that `supports_credentials` is `true` in `config/cors.php`; the frontend's Axios instance must also send `withCredentials: true`. |
| `No application encryption key has been specified` | Run `php artisan key:generate`. |

## Phase 2 — Authentication

Added: register, login, logout, me, forgot/reset password, change password,
update profile, upload profile image. Email verification is deferred (not
wired yet — the `mail` driver is `log` for now).

Run `php artisan migrate` again to pick up the new
`2026_02_01_000000_add_profile_fields_to_users_table.php` migration, and
`php artisan storage:link` once so uploaded profile images are web-reachable
at `/storage/profile-images/...`.

```bash
# Register
curl -X POST http://127.0.0.1:8000/api/v1/auth/register \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Login (use -c/-b to persist the session cookie across requests)
curl -X POST http://127.0.0.1:8000/api/v1/auth/login -c cookies.txt \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Current user
curl http://127.0.0.1:8000/api/v1/me -b cookies.txt -H "Accept: application/json"
```

From the React app, `ensureCsrfCookie()` (in `src/services/api.js`) must be
called before register/login since Sanctum's SPA auth is cookie + CSRF
based, not bearer-token based.

## Phase 3 — Roles & Permissions

Added `roles`, `permissions`, `role_user`, `permission_role` tables,
`Role`/`Permission` models, and real `User::hasRole()/hasAnyRole()/
hasPermission()` (the Phase 1 stub is gone). Every new registration is now
auto-assigned the `buyer` role. The `role:*` middleware used on
`/api/v1/admin/*` and `/api/v1/seller/*` is now fully live.

```bash
php artisan migrate
php artisan db:seed
# seeds 3 roles (admin, seller, buyer) + 5 starter permissions, all
# attached to the admin role
```

To test admin-only role assignment, manually attach the `admin` role to a
user once via tinker (no UI for this yet — Phase 6 adds one):

```bash
php artisan tinker
>>> $u = App\Models\User::first();
>>> $u->roles()->attach(App\Models\Role::where('slug','admin')->first());
```

Then, logged in as that user:

```bash
curl http://127.0.0.1:8000/api/v1/admin/roles -b cookies.txt -H "Accept: application/json"

curl -X POST http://127.0.0.1:8000/api/v1/admin/users/2/roles/assign -b cookies.txt \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"role":"seller"}'
```

## Phase 4 — Database Schema

23 new migrations covering the full catalog/cart/order/payment/support
schema, plus their Eloquent models with relationships wired up (no
controllers/routes yet — that's Phase 5+ resource by resource).

Tables added: `seller_profiles`, `categories`, `subcategories`, `brands`,
`products`, `product_images`, `product_variants`, `product_attributes`,
`addresses`, `carts`, `cart_items`, `wishlists`, `wishlist_items`,
`shipping_methods`, `coupons`, `orders`, `order_items`, `coupon_usages`,
`payments`, `transactions`, `reviews`, `review_images`, `notifications`,
`seller_payouts`, `returns`, `refunds`, `support_tickets`,
`support_ticket_replies`.

Two deliberate deviations from the literal table list, both noted inline
in the migration/model files:
- `notifications` uses Laravel's standard database-notification shape
  (uuid PK, morphs, `data`, `read_at`) so `User`'s existing `Notifiable`
  trait works immediately and email channels bolt on later with no
  schema change.
- `support_ticket_replies` was added (not in the original list) because a
  ticket needs somewhere to store the back-and-forth; a single `message`
  column on `support_tickets` can't hold a conversation.
- The `ReturnRequest` model maps to the `returns` table under a different
  class name, since `Return` is a reserved PHP keyword.

Multi-seller carts are handled by keeping `product_id`/`product_variant_id`
on `cart_items`, then splitting into per-seller `order_items` (each row
carries its own `seller_id`, `commission_percent`, `commission_amount`,
`seller_earning`, and `status`) at checkout time in Phase 19 — so one
`orders` row can fan out to several sellers' items with independent
fulfillment status.

```bash
php artisan migrate
php artisan db:seed   # now also seeds 2 default shipping methods
```

Every file here has been syntax-checked with `php -l` (30 models + 27
migrations, zero errors) — full `php artisan migrate` against a real MySQL
DB still needs your own machine, since this sandbox has PHP but no MySQL
and no Composer/Packagist access.

## Phase 5 — Admin Dashboard

Added `GET /api/v1/admin/dashboard/stats` (the 10 summary numbers) and
`GET /api/v1/admin/dashboard/charts` (daily sales, monthly sales, top 5
products, top 5 sellers, category performance, new users - last 7/12
days/months). Logic lives in `DashboardService`, not the controller.

```bash
curl http://127.0.0.1:8000/api/v1/admin/dashboard/stats -b cookies.txt -H "Accept: application/json"
curl http://127.0.0.1:8000/api/v1/admin/dashboard/charts -b cookies.txt -H "Accept: application/json"
```

(Use the tinker trick from Phase 3 to make your test user an admin first.)
With no products/orders seeded yet, stats return zeros and chart arrays
come back empty - that's expected until Phase 10/19 add real data.

## What's next (Phase 6)

- Admin user management: list/search/filter/create/edit users, change
  roles, activate/deactivate, view order history
