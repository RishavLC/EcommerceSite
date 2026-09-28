import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchUsers, setUserActive } from '../../services/adminService'

export default function Users() {
  const [filters, setFilters] = useState({ search: '', role: '', status: '', page: 1 })
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchUsers(filters)
      setUsers(res.data)
      setMeta(res.meta)
    } catch {
      setError('Could not load users.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 })

  const toggleActive = async (u) => {
    const activating = u.status !== 'active'
    if (!window.confirm(`${activating ? 'Activate' : 'Deactivate'} ${u.name}?`)) return
    try {
      await setUserActive(u.id, activating)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Users</h1>
        <Link to="/admin/users/new" className="rounded bg-slate-800 px-3 py-2 text-sm text-white">New user</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <input name="search" placeholder="Search name, email, phone" value={filters.search}
          onChange={handleFilter} className="w-64 rounded border px-3 py-2 text-sm" />
        <select name="role" value={filters.role} onChange={handleFilter} className="rounded border px-3 py-2 text-sm">
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
          <option value="buyer">Buyer</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilter} className="rounded border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">Loading...</td></tr>}
            {!loading && users.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No users found.</td></tr>
            )}
            {!loading && users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.roles.map((r) => r.name).join(', ')}</td>
                <td className="px-4 py-3">{u.status}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link to={`/admin/users/${u.id}`} className="text-slate-700 underline">View</Link>
                  <Link to={`/admin/users/${u.id}/edit`} className="text-slate-700 underline">Edit</Link>
                  <button onClick={() => toggleActive(u)} className="text-slate-700 underline">
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Page {meta.current_page} of {meta.last_page} ({meta.total} users)</span>
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
