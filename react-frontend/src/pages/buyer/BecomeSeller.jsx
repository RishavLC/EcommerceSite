import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchMySellerApplication, applyForSeller } from '../../services/buyerService'

const FIELDS = [
  ['full_name', 'Full name'],
  ['store_name', 'Store / business name'],
  ['phone', 'Phone'],
  ['address_line', 'Street address'],
  ['city', 'City'],
  ['province', 'Province'],
  ['postal_code', 'Postal code (optional)'],
  ['verification_number', 'Verification number'],
  ['bank_name', 'Bank name'],
  ['bank_account_name', 'Account holder name'],
  ['bank_account_number', 'Account number'],
]

const emptyForm = Object.fromEntries([...FIELDS.map(([k]) => [k, '']), ['description', ''], ['verification_type', 'citizenship']])

export default function BecomeSeller() {
  const { reloadUser } = useAuth()
  const [application, setApplication] = useState(undefined) // undefined = loading, null = none
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    const app = await fetchMySellerApplication()
    setApplication(app)
    if (app?.status === 'rejected') {
      setForm((f) => Object.fromEntries(Object.keys(f).map((k) => [k, app[k] ?? ''])))
    }
    if (app?.status === 'approved') reloadUser() // pick up the new seller role
  }

  useEffect(() => { load().catch(() => setApplication(null)) }, []) // eslint-disable-line

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!file) return setError('Please attach a verification document.')
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('verification_document', file)
      await applyForSeller(fd)
      await load()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Submission failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (application === undefined) return <p className="text-sm text-slate-500">Loading...</p>

  const statusMessages = {
    pending: 'Your application is under review. We will notify you once it is decided.',
    approved: 'You are an approved seller. Your seller dashboard arrives in the next phase.',
    suspended: 'Your seller account is suspended.',
  }

  if (application && application.status !== 'rejected') {
    return (
      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-slate-800">Seller application</h1>
        <p className="text-sm text-slate-600">Store: <b>{application.store_name}</b></p>
        <p className="mt-1 text-sm text-slate-600">Status: <b className="capitalize">{application.status}</b></p>
        <p className="mt-3 text-sm text-slate-600">{statusMessages[application.status]}</p>
        {application.status === 'suspended' && application.rejection_reason && (
          <p className="mt-2 text-sm text-red-600">Reason: {application.rejection_reason}</p>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-xl font-semibold text-slate-800">Become a seller</h1>
      {application?.status === 'rejected' && (
        <p className="mb-3 rounded bg-red-50 p-3 text-sm text-red-700">
          Your previous application was rejected: {application.rejection_reason}. You can correct it and apply again.
        </p>
      )}
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map(([name, label]) => (
          <input key={name} name={name} placeholder={label} value={form[name]} onChange={handleChange}
            required={name !== 'postal_code'} className="rounded border px-3 py-2 text-sm" />
        ))}
        <select name="verification_type" value={form.verification_type} onChange={handleChange}
          className="rounded border px-3 py-2 text-sm">
          <option value="citizenship">Citizenship</option>
          <option value="pan">PAN</option>
          <option value="business_registration">Business registration</option>
        </select>
        <textarea name="description" placeholder="Store description" required rows="3"
          value={form.description} onChange={handleChange} className="rounded border px-3 py-2 text-sm sm:col-span-2" />
        <label className="text-sm text-slate-600 sm:col-span-2">
          Verification document (JPG, PNG or PDF, max 4MB)
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" required
            onChange={(e) => setFile(e.target.files[0])} className="mt-1 block text-sm" />
        </label>
        <button type="submit" disabled={submitting}
          className="rounded bg-slate-800 py-2 text-sm text-white disabled:opacity-50 sm:col-span-2">
          {submitting ? 'Submitting...' : 'Submit application'}
        </button>
      </form>
    </div>
  )
}
