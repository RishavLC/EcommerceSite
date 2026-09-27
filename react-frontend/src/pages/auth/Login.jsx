import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Login</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" type="email" placeholder="Email" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.password} onChange={handleChange} />
        <button type="submit" disabled={submitting}
          className="w-full rounded bg-slate-800 py-2 text-sm text-white disabled:opacity-50">
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/register" className="text-slate-600">Create account</Link>
        <Link to="/forgot-password" className="text-slate-600">Forgot password?</Link>
      </div>
    </div>
  )
}
