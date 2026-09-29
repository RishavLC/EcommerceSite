import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories, deleteCategory, toggleCategoryActive } from '../../services/catalogService'

export default function Categories() {
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 })
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchCategories(filters)
      setRows(res.data)
      setMeta(res.meta)
    } catch {
      setError('Could not load categories.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })

  const handleToggle = async (id) => {
    try { await toggleCategoryActive(id); load() } catch { alert('Action failed.') }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone from the UI.`)) return
    try { await deleteCategory(id); load() } catch (err) { alert(err.response?.data?.message || 'Delete failed.') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Categories</h1>
        <Link to="/admin/categories/new" className="rounded bg-slate-800 px-3 py-2 text-sm text-white">New category</Link>
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
              <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No categories found.</td></tr>
            )}
            {!loading && rows.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-slate-500">{c.slug}</td>
                <td className="px-4 py-3">{c.products_count}</td>
                <td className="px-4 py-3">{c.is_active ? 'Active' : 'Inactive'}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link to={`/admin/categories/${c.id}/edit`} className="text-slate-700 underline">Edit</Link>
                  <button onClick={() => handleToggle(c.id)} className="text-slate-700 underline">
                    {c.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-red-700 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Page {meta.current_page} of {meta.last_page} ({meta.total} categories)</span>
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
