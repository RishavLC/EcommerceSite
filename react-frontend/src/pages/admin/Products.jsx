import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminProducts } from '../../services/adminService'

const STATUS_LABEL = {
  draft: 'Draft', pending: 'Pending review', rejected: 'Rejected', active: 'Active', inactive: 'Inactive',
}

export default function Products() {
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 })
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchAdminProducts(filters)
      setRows(res.data)
      setMeta(res.meta)
    } catch {
      setError('Could not load products.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Products</h1>

      <div className="flex flex-wrap gap-2">
        <input name="search" placeholder="Search name" value={filters.search}
          onChange={handleFilter} className="w-64 rounded border px-3 py-2 text-sm" />
        <select name="status" value={filters.status} onChange={handleFilter} className="rounded border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-500">Loading...</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-500">No products found.</td></tr>
            )}
            {!loading && rows.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.seller?.name}</td>
                <td className="px-4 py-3">{p.category?.name}</td>
                <td className="px-4 py-3">Rs. {Number(p.price).toLocaleString()}</td>
                <td className="px-4 py-3">{STATUS_LABEL[p.status]}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/products/${p.id}`} className="text-slate-700 underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Page {meta.current_page} of {meta.last_page} ({meta.total} products)</span>
          <div className="space-x-2">
            <button disabled={meta.current_page <= 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="rounded border px-3 py-1 disabled:opacity-40">Prev</button>
            <button disabled={meta.current_page >= meta.last_page}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="rounded border px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
