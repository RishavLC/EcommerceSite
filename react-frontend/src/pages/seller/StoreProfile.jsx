import { useEffect, useState } from 'react'
import { fetchStoreProfile, updateStoreProfile } from '../../services/sellerService'

export default function StoreProfile() {
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchStoreProfile()
      .then((p) => setForm({
        business_name: p.business_name || '',
        phone: p.phone || '',
        description: p.description || '',
        address_line: p.address_line || '',
        city: p.city || '',
        province: p.province || '',
        postal_code: p.postal_code || '',
        bank_account_name: p.bank_account_name || '',
        bank_account_number: p.bank_account_number || '',
        bank_name: p.bank_name || '',
        store_name: p.store_name,
        store_slug: p.store_slug,
      }))
      .catch(() => setError('Could not load store profile.'))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const { store_name, store_slug, ...editable } = form
      await updateStoreProfile(editable)
      setSuccess('Store profile updated.')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Update failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (error && !form) return <p className="text-sm text-red-600">{error}</p>
  if (!form) return <p className="text-sm text-slate-500">Loading...</p>

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{form.store_name}</h1>
        <p className="text-sm text-slate-500">/store/{form.store_slug} (store name can't be changed here - contact support)</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
        <input name="business_name" placeholder="Business name" value={form.business_name}
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
        <input name="postal_code" placeholder="Postal code" value={form.postal_code}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <p className="pt-2 text-xs font-medium uppercase text-slate-500">Payout information</p>
        <input name="bank_account_name" placeholder="Bank account holder name" required value={form.bank_account_name}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <input name="bank_account_number" placeholder="Bank account number" required value={form.bank_account_number}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <input name="bank_name" placeholder="Bank name" required value={form.bank_name}
          onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
        <button type="submit" disabled={submitting}
          className="rounded bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50">
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
