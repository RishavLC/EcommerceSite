import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchSellerProduct, createSellerProduct, updateSellerProduct } from '../../services/sellerProductService'
import { fetchCategories, fetchSubcategories, fetchBrands } from '../../services/catalogService'

const emptyVariant = { sku: '', size: '', color: '', price: '', stock: '' }
const emptyAttribute = { name: '', value: '' }

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [brands, setBrands] = useState([])

  const [form, setForm] = useState({
    name: '', category_id: '', subcategory_id: '', brand_id: '', description: '',
    sku: '', price: '', discount_price: '', stock: '', weight: '', dimensions: '',
  })
  const [variants, setVariants] = useState([])
  const [attributes, setAttributes] = useState([])
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories({ per_page: 100 }).then((res) => setCategories(res.data)).catch(() => {})
    fetchBrands({ per_page: 100 }).then((res) => setBrands(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!form.category_id) { setSubcategories([]); return }
    fetchSubcategories({ category_id: form.category_id, per_page: 100 })
      .then((res) => setSubcategories(res.data)).catch(() => {})
  }, [form.category_id])

  useEffect(() => {
    if (!isEdit) return
    fetchSellerProduct(id).then((p) => {
      setForm({
        name: p.name, category_id: p.category_id, subcategory_id: p.subcategory_id || '',
        brand_id: p.brand_id || '', description: p.description || '', sku: p.sku,
        price: p.price, discount_price: p.discount_price || '', stock: p.stock,
        weight: p.weight || '', dimensions: p.dimensions || '',
      })
      setVariants((p.variants || []).map((v) => ({
        sku: v.sku, size: v.attributes?.size || '', color: v.attributes?.color || '',
        price: v.price || '', stock: v.stock,
      })))
      setAttributes((p.attributes || []).map((a) => ({ name: a.name, value: a.value })))
      setExistingImages(p.images || [])
    }).catch(() => setError('Could not load product.'))
  }, [id, isEdit])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleVariantChange = (i, field, value) => {
    const next = [...variants]
    next[i] = { ...next[i], [field]: value }
    setVariants(next)
  }
  const addVariant = () => setVariants([...variants, { ...emptyVariant }])
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i))

  const handleAttributeChange = (i, field, value) => {
    const next = [...attributes]
    next[i] = { ...next[i], [field]: value }
    setAttributes(next)
  }
  const addAttribute = () => setAttributes([...attributes, { ...emptyAttribute }])
  const removeAttribute = (i) => setAttributes(attributes.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        subcategory_id: form.subcategory_id || null,
        brand_id: form.brand_id || null,
        discount_price: form.discount_price || null,
        images,
        variants: variants
          .filter((v) => v.sku && v.stock !== '')
          .map((v) => ({
            sku: v.sku,
            price: v.price || null,
            stock: v.stock,
            attributes: Object.fromEntries(
              Object.entries({ size: v.size, color: v.color }).filter(([, val]) => val)
            ),
          })),
        attributes: attributes.filter((a) => a.name && a.value),
      }
      if (isEdit) await updateSellerProduct(id, payload)
      else await createSellerProduct(payload)
      navigate('/seller/products')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Save failed.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">{isEdit ? 'Edit product' : 'New product'}</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
          <input name="name" placeholder="Product name" required value={form.name}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <div className="grid grid-cols-3 gap-3">
            <select name="category_id" required value={form.category_id} onChange={handleChange}
              className="rounded border px-3 py-2 text-sm">
              <option value="">Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select name="subcategory_id" value={form.subcategory_id} onChange={handleChange}
              className="rounded border px-3 py-2 text-sm">
              <option value="">Subcategory (optional)</option>
              {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select name="brand_id" value={form.brand_id} onChange={handleChange}
              className="rounded border px-3 py-2 text-sm">
              <option value="">Brand (optional)</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <textarea name="description" placeholder="Description" value={form.description}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" rows={3} />
          <input name="sku" placeholder="SKU (auto-generated if blank)" value={form.sku}
            onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" step="0.01" placeholder="Price" required value={form.price}
              onChange={handleChange} className="rounded border px-3 py-2 text-sm" />
            <input name="discount_price" type="number" step="0.01" placeholder="Discount price (optional)"
              value={form.discount_price} onChange={handleChange} className="rounded border px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input name="stock" type="number" placeholder="Stock" required value={form.stock}
              onChange={handleChange} className="rounded border px-3 py-2 text-sm" />
            <input name="weight" type="number" step="0.01" placeholder="Weight (kg, optional)" value={form.weight}
              onChange={handleChange} className="rounded border px-3 py-2 text-sm" />
            <input name="dimensions" placeholder="Dimensions (optional)" value={form.dimensions}
              onChange={handleChange} className="rounded border px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-slate-700">Images</h2>
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <span key={img.id} className="rounded border px-2 py-1 text-xs text-slate-500">
                  {img.path.split('/').pop()} {img.is_primary && '(primary)'}
                </span>
              ))}
            </div>
          )}
          <input type="file" multiple accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full text-sm" />
          <p className="text-xs text-slate-500">Up to 8 images, 2MB each. New uploads are added to existing ones.</p>
        </div>

        <div className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-700">Variants (size / color)</h2>
            <button type="button" onClick={addVariant} className="text-sm text-slate-700 underline">+ Add variant</button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-6 gap-2">
              <input placeholder="SKU" value={v.sku} onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                className="col-span-2 rounded border px-2 py-1 text-sm" />
              <input placeholder="Size" value={v.size} onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                className="rounded border px-2 py-1 text-sm" />
              <input placeholder="Color" value={v.color} onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                className="rounded border px-2 py-1 text-sm" />
              <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                className="rounded border px-2 py-1 text-sm" />
              <button type="button" onClick={() => removeVariant(i)} className="text-xs text-red-700">Remove</button>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-700">Spec attributes</h2>
            <button type="button" onClick={addAttribute} className="text-sm text-slate-700 underline">+ Add attribute</button>
          </div>
          {attributes.map((a, i) => (
            <div key={i} className="grid grid-cols-5 gap-2">
              <input placeholder="Name (e.g. Material)" value={a.name}
                onChange={(e) => handleAttributeChange(i, 'name', e.target.value)}
                className="col-span-2 rounded border px-2 py-1 text-sm" />
              <input placeholder="Value (e.g. Cotton)" value={a.value}
                onChange={(e) => handleAttributeChange(i, 'value', e.target.value)}
                className="col-span-2 rounded border px-2 py-1 text-sm" />
              <button type="button" onClick={() => removeAttribute(i)} className="text-xs text-red-700">Remove</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="rounded bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save product'}
          </button>
          <Link to="/seller/products" className="px-4 py-2 text-sm text-slate-600">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
