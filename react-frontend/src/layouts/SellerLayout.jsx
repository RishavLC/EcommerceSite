import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/seller', label: 'Dashboard', end: true },
  { to: '/seller/products', label: 'Products' },
  { to: '/seller/inventory', label: 'Inventory' },
  { to: '/seller/orders', label: 'Orders' },
  { to: '/seller/customers', label: 'Customers' },
  { to: '/seller/reviews', label: 'Reviews' },
  { to: '/seller/coupons', label: 'Coupons' },
  { to: '/seller/earnings', label: 'Earnings' },
  { to: '/seller/payouts', label: 'Payouts' },
  { to: '/seller/store-profile', label: 'Store Profile' },
  { to: '/seller/store-settings', label: 'Store Settings' },
]

export default function SellerLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-56 shrink-0 border-r bg-white">
        <div className="border-b px-4 py-4 text-lg font-bold text-slate-800">Seller</div>
        <nav className="flex flex-col p-2 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded px-3 py-2 ${isActive ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
