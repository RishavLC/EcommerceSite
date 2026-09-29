import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  fetchSeller, approveSeller, rejectSeller, suspendSeller, activateSeller,
} from '../../services/adminService'

export default function SellerDetail() {
  const { id } = useParams()
  const [seller, setSeller] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reason, setReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const load = () => fetchSeller(id).then(setSeller).catch(() => setError('Could not load seller.'))

  useEffect(() => { load() }, [id])

  const runAction = async (fn, ...args) => {
    setBusy(true)
    setError('')
    try {
      await fn(id, ...args)
      await load()
      setShowRejectForm(false)
      setReason('')
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.')
    } finally {
      setBusy(false)
    }
  }

  if (error && !seller) return <p className="text-sm text-red-600">{error}</p>
  if (!seller) return <p className="text-sm text-slate-500">Loading...</p>

  const rows = [
    ['Owner', `${seller.user?.name} (${seller.user?.email})`],
    ['Business name', seller.business_name || '-'],
    ['Phone', seller.phone || '-'],
    ['Description', seller.description || '-'],
    ['Address', [seller.address_line, seller.city, seller.province, seller.postal_code].filter(Boolean).join(', ')],
    ['Bank account name', seller.bank_account_name],
    ['Bank account number', seller.bank_account_number],
    ['Bank name', seller.bank_name],
    ['Status', seller.status],
  ]
  if (seller.status === 'rejected') rows.push(['Rejection reason', seller.rejection_reason || '-'])

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">{seller.store_name}</h1>
        <Link to="/admin/sellers" className="text-sm text-slate-700 underline">Back</Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <dl className="grid grid-cols-3 gap-y-2 rounded-lg bg-white p-4 text-sm shadow-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-slate-500">{k}</dt>
            <dd className="col-span-2 text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2">
        {seller.status === 'pending' && (
          <>
            <button disabled={busy} onClick={() => runAction(approveSeller)}
              className="rounded bg-green-700 px-4 py-2 text-sm text-white disabled:opacity-50">Approve</button>
            <button disabled={busy} onClick={() => setShowRejectForm(true)}
              className="rounded bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-50">Reject</button>
          </>
        )}
        {seller.status === 'approved' && (
          <button disabled={busy} onClick={() => runAction(suspendSeller)}
            className="rounded bg-amber-700 px-4 py-2 text-sm text-white disabled:opacity-50">Suspend</button>
        )}
        {seller.status === 'suspended' && (
          <button disabled={busy} onClick={() => runAction(activateSeller)}
            className="rounded bg-green-700 px-4 py-2 text-sm text-white disabled:opacity-50">Reactivate</button>
        )}
      </div>

      {showRejectForm && (
        <div className="max-w-md space-y-2 rounded-lg bg-white p-4 shadow-sm">
          <textarea value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection" className="w-full rounded border px-3 py-2 text-sm" rows={3} />
          <div className="flex gap-2">
            <button disabled={busy || !reason} onClick={() => runAction(rejectSeller, reason)}
              className="rounded bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-50">Confirm reject</button>
            <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
