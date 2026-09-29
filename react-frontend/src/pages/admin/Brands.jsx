import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchBrands, deleteBrand, toggleBrandActive } from '../../services/catalogService'

export default function Brands() {
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 })
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchBrands(filters)
      setRows(res.data)
      setMeta(res.meta)
    } catch {
      setError('Could not load brands.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })

  const handleToggle = async (id) => {
    try { await toggleBrandActive(id); load() } catch { alert('Action failed.') }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This permanently removes the brand.`)) return
    try { await deleteBrand(id); load() } catch (err) { alert(err.response?.data?.message || 'Delete failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Brands</h1>
        <Link to="/admin/brands/new" className="rounded bg-slate-800 px-3 py-2 text-sm text-white">New brand</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <input name="search" placeholder="Search name" value={filters.search}
          onChange={handleFilter} className="w-64 rounded border px-3 py-2 text-sm" />
        <select name="status" value={filters.status} onChange={handleFilter} className="rounded border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">Loading...</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No brands found.</td></tr>
            )}
            {!loading && rows.map((b) => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3 text-slate-500">{b.slug}</td>
                <td className="px-4 py-3">{b.products_count}</td>
                <td className="px-4 py-3">{b.is_active ? 'Active' : 'Inactive'}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link to={`/admin/brands/${b.id}/edit`} className="text-slate-700 underline">Edit</Link>
                  <button onClick={() => handleToggle(b.id)} className="text-slate-700 underline">
                    {b.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(b.id, b.name)} className="text-red-700 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Page {meta.current_page} of {meta.last_page} ({meta.total} brands)</span>
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
