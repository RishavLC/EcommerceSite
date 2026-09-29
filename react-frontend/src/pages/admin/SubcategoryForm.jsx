import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchSubcategory, createSubcategory, updateSubcategory, fetchCategories } from '../../services/catalogService'

export default function SubcategoryForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ category_id: '', name: '', image: '', is_active: true })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories({ per_page: 100 }).then((res) => setCategories(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    fetchSubcategory(id)
      .then((s) => setForm({
        category_id: s.category_id, name: s.name, image: s.image || '', is_active: s.is_active,
      }))
      .catch(() => setError('Could not load subcategory.'))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = { ...form, image: form.image || null }
      if (isEdit) await updateSubcategory(id, payload)
      else await createSubcategory(payload)
      navigate('/admin/subcategories')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Save failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">{isEdit ? 'Edit subcategory' : 'New subcategory'}</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <select name="category_id" required value={form.category_id} onChange={handleChange}
          className="w-full rounded border px-3 py-2 text-sm">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="name" placeholder="Name" required value={form.name}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <input name="image" placeholder="Image URL (optional)" value={form.image}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          Active
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="rounded bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <Link to="/admin/subcategories" className="px-4 py-2 text-sm text-slate-600">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
