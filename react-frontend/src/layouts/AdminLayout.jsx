import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/sellers', label: 'Sellers' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/subcategories', label: 'Subcategories' },
  { to: '/admin/brands', label: 'Brands' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/returns', label: 'Returns' },
  { to: '/admin/refunds', label: 'Refunds' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/support-tickets', label: 'Support Tickets' },
  { to: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-56 shrink-0 border-r bg-white">
        <div className="border-b px-4 py-4 text-lg font-bold text-slate-800">Admin</div>
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
