import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchUser, createUser, updateUser } from '../../services/adminService'

const ROLE_OPTIONS = ['admin', 'seller', 'buyer']

export default function UserForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', status: 'active', roles: ['buyer'],
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    fetchUser(id)
      .then((u) => setForm({
        name: u.name, email: u.email, phone: u.phone || '', password: '',
        status: u.status, roles: u.roles.map((r) => r.slug),
      }))
      .catch(() => setError('Could not load user.'))
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleRole = (slug) => {
    const roles = form.roles.includes(slug) ? form.roles.filter((r) => r !== slug) : [...form.roles, slug]
    setForm({ ...form, roles })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = { ...form, phone: form.phone || null }
      if (isEdit && !payload.password) delete payload.password
      if (isEdit) await updateUser(id, payload)
      else await createUser(payload)
      navigate('/admin/users')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Save failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">{isEdit ? 'Edit user' : 'New user'}</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full name" required value={form.name}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <input name="email" type="email" placeholder="Email" required value={form.email}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <input name="phone" placeholder="Phone (optional)" value={form.phone}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <input name="password" type="password" required={!isEdit}
          placeholder={isEdit ? 'New password (leave blank to keep)' : 'Password'}
          value={form.password} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <select name="status" value={form.status} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <div className="flex gap-4 text-sm">
          {ROLE_OPTIONS.map((slug) => (
            <label key={slug} className="flex items-center gap-1 capitalize">
              <input type="checkbox" checked={form.roles.includes(slug)} onChange={() => toggleRole(slug)} />
              {slug}
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="rounded bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <Link to="/admin/users" className="px-4 py-2 text-sm text-slate-600">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
