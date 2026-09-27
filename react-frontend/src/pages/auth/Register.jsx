import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Registration failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Create account</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full name" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.password} onChange={handleChange} />
        <input name="password_confirmation" type="password" placeholder="Confirm password" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.password_confirmation} onChange={handleChange} />
        <button type="submit" disabled={submitting}
          className="w-full rounded bg-slate-800 py-2 text-sm text-white disabled:opacity-50">
          {submitting ? 'Creating...' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-sm">
        <Link to="/login" className="text-slate-600">Already have an account? Login</Link>
      </div>
    </div>
  )
}
