import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchSubcategories, deleteSubcategory, toggleSubcategoryActive } from '../../services/catalogService'

export default function Subcategories() {
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 })
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchSubcategories(filters)
      setRows(res.data)
      setMeta(res.meta)
    } catch {
      setError('Could not load subcategories.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })

  const handleToggle = async (id) => {
    try { await toggleSubcategoryActive(id); load() } catch { alert('Action failed.') }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try { await deleteSubcategory(id); load() } catch (err) { alert(err.response?.data?.message || 'Delete failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Subcategories</h1>
        <Link to="/admin/subcategories/new" className="rounded bg-slate-800 px-3 py-2 text-sm text-white">New subcategory</Link>
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
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">Loading...</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No subcategories found.</td></tr>
            )}
            {!loading && rows.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.category?.name}</td>
                <td className="px-4 py-3">{s.products_count}</td>
                <td className="px-4 py-3">{s.is_active ? 'Active' : 'Inactive'}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link to={`/admin/subcategories/${s.id}/edit`} className="text-slate-700 underline">Edit</Link>
                  <button onClick={() => handleToggle(s.id)} className="text-slate-700 underline">
                    {s.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(s.id, s.name)} className="text-red-700 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Page {meta.current_page} of {meta.last_page} ({meta.total} subcategories)</span>
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
