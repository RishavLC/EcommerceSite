import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { applyAsSeller, fetchMySellerApplication } from '../../services/sellerService'

const STATUS_COPY = {
  pending: 'Your application is pending review.',
  approved: 'Your seller account is approved - you can manage products from the Seller dashboard.',
  rejected: 'Your application was rejected. You can review the reason below and reapply.',
  suspended: 'Your seller account is currently suspended. Contact support for details.',
}

const emptyForm = {
  store_name: '', business_name: '', phone: '', description: '',
  address_line: '', city: '', province: '', postal_code: '',
  bank_account_name: '', bank_account_number: '', bank_name: '',
}

export default function Apply() {
  const { reloadUser } = useAuth()
  const [application, setApplication] = useState(undefined) // undefined = loading
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchMySellerApplication()
      .then(setApplication)
      .catch(() => setApplication(null))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const profile = await applyAsSeller(form)
      setApplication(profile)
      setSuccess('Application submitted.')
      reloadUser()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Submission failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (application === undefined) return <p className="text-sm text-slate-500">Loading...</p>

  const canApply = !application || application.status === 'rejected'

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Become a Seller</h1>

      {application && (
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700">Status: {application.status}</p>
          <p className="mt-1 text-sm text-slate-600">{STATUS_COPY[application.status]}</p>
          {application.status === 'rejected' && application.rejection_reason && (
            <p className="mt-1 text-sm text-red-600">Reason: {application.rejection_reason}</p>
          )}
        </div>
      )}

      {success && <p className="text-sm text-green-600">{success}</p>}

      {canApply && (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input name="store_name" placeholder="Store name" required value={form.store_name}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <input name="business_name" placeholder="Business name (optional)" value={form.business_name}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <input name="phone" placeholder="Phone" required value={form.phone}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <textarea name="description" placeholder="Store description" value={form.description}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" rows={3} />
          <input name="address_line" placeholder="Address" required value={form.address_line}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input name="city" placeholder="City" required value={form.city}
              onChange={handleChange} className="rounded border px-3 py-2 text-sm" />
            <input name="province" placeholder="Province" required value={form.province}
              onChange={handleChange} className="rounded border px-3 py-2 text-sm" />
          </div>
          <input name="postal_code" placeholder="Postal code (optional)" value={form.postal_code}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <p className="pt-2 text-xs font-medium uppercase text-slate-500">Payout information</p>
          <input name="bank_account_name" placeholder="Bank account holder name" required value={form.bank_account_name}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <input name="bank_account_number" placeholder="Bank account number" required value={form.bank_account_number}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <input name="bank_name" placeholder="Bank name" required value={form.bank_name}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <button type="submit" disabled={submitting}
            className="w-full rounded bg-slate-800 py-2 text-sm text-white disabled:opacity-50">
            {submitting ? 'Submitting...' : (application ? 'Reapply' : 'Submit application')}
          </button>
        </form>
      )}
    </div>
  )
}
