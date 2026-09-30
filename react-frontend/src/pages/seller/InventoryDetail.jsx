import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchSellerProduct } from '../../services/sellerProductService'
import { restockProduct, adjustStock, fetchStockHistory } from '../../services/inventoryService'

export default function InventoryDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [variantId, setVariantId] = useState('')
  const [restockQty, setRestockQty] = useState('')
  const [restockNote, setRestockNote] = useState('')
  const [adjustDelta, setAdjustDelta] = useState('')
  const [adjustNote, setAdjustNote] = useState('')

  const loadProduct = useCallback(() => {
    fetchSellerProduct(id).then(setProduct).catch(() => setError('Could not load product.'))
  }, [id])

  const loadHistory = useCallback(() => {
    fetchStockHistory(id, { per_page: 20 }).then((res) => setHistory(res.data)).catch(() => {})
  }, [id])

  useEffect(() => { loadProduct(); loadHistory() }, [loadProduct, loadHistory])

  const handleRestock = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await restockProduct(id, { quantity: Number(restockQty), note: restockNote || null, variant_id: variantId || null })
      setRestockQty(''); setRestockNote('')
      loadProduct(); loadHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'Restock failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleAdjust = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await adjustStock(id, { delta: Number(adjustDelta), note: adjustNote, variant_id: variantId || null })
      setAdjustDelta(''); setAdjustNote('')
      loadProduct(); loadHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'Adjustment failed.')
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
        <Link to="/seller/inventory" className="text-sm text-slate-700 underline">Back</Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <dl className="grid grid-cols-4 gap-y-2 rounded-lg bg-white p-4 text-sm shadow-sm">
        {[
          ['Stock', product.stock], ['Reserved', product.reserved_stock],
          ['Available', product.available_stock], ['Sold (lifetime)', product.sold_stock],
        ].map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-slate-500">{k}</dt>
            <dd className="text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>

      {product.variants?.length > 0 && (
        <div className="rounded-lg bg-white p-4 text-sm shadow-sm">
          <p className="mb-2 font-medium text-slate-700">Variants</p>
          <ul className="space-y-1 text-slate-600">
            {product.variants.map((v) => (
              <li key={v.id}>
                {v.sku} - stock {v.stock}, reserved {v.reserved_stock}, available {v.available_stock}, sold {v.sold_stock}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <form onSubmit={handleRestock} className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
          <p className="font-medium text-slate-700">Restock</p>
          {product.variants?.length > 0 && (
            <select value={variantId} onChange={(e) => setVariantId(e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
              <option value="">Whole product (no variant)</option>
              {product.variants.map((v) => <option key={v.id} value={v.id}>{v.sku}</option>)}
            </select>
          )}
          <input type="number" min="1" required placeholder="Quantity to add" value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)} className="w-full rounded border px-2 py-1 text-sm" />
          <input placeholder="Note (optional)" value={restockNote}
            onChange={(e) => setRestockNote(e.target.value)} className="w-full rounded border px-2 py-1 text-sm" />
          <button type="submit" disabled={busy} className="rounded bg-green-700 px-3 py-1.5 text-sm text-white disabled:opacity-50">Add stock</button>
        </form>

        <form onSubmit={handleAdjust} className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
          <p className="font-medium text-slate-700">Manual adjustment</p>
          <input type="number" required placeholder="Delta (e.g. -2 for damaged goods)" value={adjustDelta}
            onChange={(e) => setAdjustDelta(e.target.value)} className="w-full rounded border px-2 py-1 text-sm" />
          <input required placeholder="Reason (required)" value={adjustNote}
            onChange={(e) => setAdjustNote(e.target.value)} className="w-full rounded border px-2 py-1 text-sm" />
          <button type="submit" disabled={busy} className="rounded bg-amber-700 px-3 py-1.5 text-sm text-white disabled:opacity-50">Apply adjustment</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <h2 className="px-4 pt-4 text-sm font-medium text-slate-600">Stock history</h2>
        <table className="w-full text-left text-sm">
          <thead className="border-b text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Change</th>
              <th className="px-4 py-3">Resulting stock</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">By</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-500">No stock movements yet.</td></tr>
            )}
            {history.map((h) => (
              <tr key={h.id} className="border-b last:border-0">
                <td className="px-4 py-3 capitalize">{h.type}</td>
                <td className={`px-4 py-3 ${h.quantity_change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {h.quantity_change >= 0 ? '+' : ''}{h.quantity_change}
                </td>
                <td className="px-4 py-3">{h.quantity_after}</td>
                <td className="px-4 py-3">{h.note || '-'}</td>
                <td className="px-4 py-3">{h.user?.name || 'System'}</td>
                <td className="px-4 py-3">{new Date(h.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
