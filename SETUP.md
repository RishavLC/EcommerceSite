# ShopNest — Full-Stack E-Commerce (Laravel + React)

This was originally a skeleton project with only auth wired up (no products, cart,
checkout, or orders). It's now a complete, working system:

- **Storefront**: browse/search/filter products, product detail modal, persistent cart, checkout, order history
- **Auth**: register/login/logout (Laravel Sanctum tokens), route protection
- **Admin panel** (`/admin`): dashboard stats, full product CRUD, category CRUD, order management (status updates)
- **Checkout**: mock (no real payment gateway) — places a real order in the database, decrements stock, marks paid for demo purposes

## What changed from the original upload

The backend only had `register`/`login`/`logout` — there was literally a
`product api needed now` comment left in `routes/api.php` (outside any PHP
comment, which would have crashed the app). Everything else — products,
categories, cart, orders, admin — has been built from scratch. Full list of
backend/frontend changes is in the analysis earlier in this conversation.

## 1. Backend setup (Laravel)

```bash
cd Ecommerce
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your MySQL credentials (defaults assume a local DB named
`ecommerce`):

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

Create the database (e.g. `mysql -u root -e "CREATE DATABASE ecommerce"`), then:

```bash
php artisan migrate --seed
php artisan serve
```

This seeds:
- 7 categories, 12 demo products
- **Admin login:** `admin@shopnest.test` / `password`
- **Customer login:** `test@example.com` / `password`

The API runs at `http://127.0.0.1:8000/api`.

## 2. Frontend setup (React + Vite)

```bash
cd FrontendEcommerce
npm install
cp .env.example .env   # only needed if your API isn't at 127.0.0.1:8000
npm run dev
```

Runs at `http://localhost:5173`. CORS is already configured on the backend
(`config/cors.php`) to allow this origin — if you change ports, update
`CORS_ALLOWED_ORIGINS` in the backend `.env` too.

## 3. Try it out

- Visit the storefront, browse `/products`, search/filter/sort, add items to cart
- Register a new account or log in with the seeded customer
- Checkout — it's a **mock payment**, no card details needed, order is created immediately
- View order history at `/orders`
- Log in as the seeded admin and go to `/admin` for the dashboard, product/category CRUD, and order status management

## Notes / design choices

- Product images are emoji (matching the original design's style) rather than
  uploaded image files, to keep things simple and working out of the box.
  Swapping to real image uploads later is a matter of adding a file field to
  the admin product form and an `image` upload endpoint.
- The cart lives in the browser (localStorage) for both guests and logged-in
  users; checkout is the only step that requires login, and prices/stock are
  **re-validated server-side** at that point so nothing can be tampered with
  client-side.
- Checkout is intentionally mock (per your request) — `payment_status` is set
  to `paid` immediately. Swapping in Stripe later means adding a payment step
  before that assignment in `OrderController@store`.
