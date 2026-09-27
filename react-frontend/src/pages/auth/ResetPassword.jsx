import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../services/authService'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    token: searchParams.get('token') || '',
    email: searchParams.get('email') || '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Reset password</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" type="email" placeholder="Email" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="New password" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.password} onChange={handleChange} />
        <input name="password_confirmation" type="password" placeholder="Confirm new password" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.password_confirmation} onChange={handleChange} />
        <button type="submit" disabled={submitting}
          className="w-full rounded bg-slate-800 py-2 text-sm text-white disabled:opacity-50">
          {submitting ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </div>
  )
}
