import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const res = await forgotPassword(email)
      setMessage(res.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Forgot password</h1>
      {message && <p className="mb-3 text-sm text-green-600">{message}</p>}
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" placeholder="Email" required
          className="w-full rounded border px-3 py-2 text-sm"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" disabled={submitting}
          className="w-full rounded bg-slate-800 py-2 text-sm text-white disabled:opacity-50">
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <div className="mt-4 text-sm">
        <Link to="/login" className="text-slate-600">Back to login</Link>
      </div>
    </div>
  )
}
