import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchAdminProduct, approveProduct, rejectProduct, toggleProductActive } from '../../services/adminService'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reason, setReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const load = () => fetchAdminProduct(id).then(setProduct).catch(() => setError('Could not load product.'))

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

  if (error && !product) return <p className="text-sm text-red-600">{error}</p>
  if (!product) return <p className="text-sm text-slate-500">Loading...</p>

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">{product.name}</h1>
        <Link to="/admin/products" className="text-sm text-slate-700 underline">Back</Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {product.images?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.images.map((img) => (
            <span key={img.id} className="rounded border px-2 py-1 text-xs text-slate-500">
              {img.path.split('/').pop()} {img.is_primary && '(primary)'}
            </span>
          ))}
        </div>
      )}

      <dl className="grid grid-cols-3 gap-y-2 rounded-lg bg-white p-4 text-sm shadow-sm">
        {[
          ['Seller', product.seller?.name],
          ['Category', [product.category?.name, product.subcategory?.name].filter(Boolean).join(' / ')],
          ['Brand', product.brand?.name || '-'],
          ['SKU', product.sku],
          ['Price', `Rs. ${Number(product.price).toLocaleString()}`],
          ['Discount price', product.discount_price ? `Rs. ${Number(product.discount_price).toLocaleString()}` : '-'],
          ['Stock', product.stock],
          ['Status', product.status],
        ].map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-slate-500">{k}</dt>
            <dd className="col-span-2 text-slate-800">{v}</dd>
          </div>
        ))}
        {product.status === 'rejected' && (
          <div className="contents">
            <dt className="text-slate-500">Rejection reason</dt>
            <dd className="col-span-2 text-red-700">{product.rejection_reason}</dd>
          </div>
        )}
      </dl>

      {product.description && (
        <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
          <p className="mb-1 font-medium text-slate-700">Description</p>
          <p className="text-slate-600">{product.description}</p>
        </div>
      )}

      {product.variants?.length > 0 && (
        <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
          <p className="mb-2 font-medium text-slate-700">Variants</p>
          <ul className="space-y-1 text-slate-600">
            {product.variants.map((v) => (
              <li key={v.id}>{v.sku} - {Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(', ')} - stock {v.stock}</li>
            ))}
          </ul>
        </div>
      )}

      {product.attributes?.length > 0 && (
        <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
          <p className="mb-2 font-medium text-slate-700">Specifications</p>
          <ul className="space-y-1 text-slate-600">
            {product.attributes.map((a) => <li key={a.id}>{a.name}: {a.value}</li>)}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {product.status === 'pending' && (
          <>
            <button disabled={busy} onClick={() => runAction(approveProduct)}
              className="rounded bg-green-700 px-4 py-2 text-sm text-white disabled:opacity-50">Approve</button>
            <button disabled={busy} onClick={() => setShowRejectForm(true)}
              className="rounded bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-50">Reject</button>
          </>
        )}
        {(product.status === 'active' || product.status === 'inactive') && (
          <button disabled={busy} onClick={() => runAction(toggleProductActive)}
            className="rounded bg-amber-700 px-4 py-2 text-sm text-white disabled:opacity-50">
            {product.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        )}
      </div>

      {showRejectForm && (
        <div className="max-w-md space-y-2 rounded-lg bg-white p-4 shadow-sm">
          <textarea value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection" className="w-full rounded border px-3 py-2 text-sm" rows={3} />
          <div className="flex gap-2">
            <button disabled={busy || !reason} onClick={() => runAction(rejectProduct, reason)}
              className="rounded bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-50">Confirm reject</button>
            <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
