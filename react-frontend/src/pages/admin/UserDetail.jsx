import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchUser, fetchUserOrders } from '../../services/adminService'

export default function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchUser(id), fetchUserOrders(id)])
      .then(([u, o]) => { setUser(u); setOrders(o.data) })
      .catch(() => setError('Could not load user.'))
  }, [id])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!user) return <p className="text-sm text-slate-500">Loading...</p>

  const rows = [
    ['Email', user.email],
    ['Phone', user.phone || '-'],
    ['Status', user.status],
    ['Roles', user.roles.map((r) => r.name).join(', ')],
    ['Address', [user.address_line, user.city, user.province, user.postal_code].filter(Boolean).join(', ') || '-'],
    ['Total orders', user.orders_count],
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">{user.name}</h1>
        <div className="space-x-3 text-sm">
          <Link to={`/admin/users/${user.id}/edit`} className="text-slate-700 underline">Edit</Link>
          <Link to="/admin/users" className="text-slate-700 underline">Back</Link>
        </div>
      </div>

      <dl className="grid max-w-xl grid-cols-3 gap-y-2 rounded-lg bg-white p-4 text-sm shadow-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-slate-500">{k}</dt>
            <dd className="col-span-2 text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <h2 className="px-4 pt-4 text-sm font-medium text-slate-600">Order history</h2>
        <table className="w-full text-left text-sm">
          <thead className="border-b text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No orders yet.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="px-4 py-3">{o.order_number}</td>
                <td className="px-4 py-3">{o.items_count}</td>
                <td className="px-4 py-3">Rs. {Number(o.total).toLocaleString()}</td>
                <td className="px-4 py-3">{o.status}</td>
                <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
