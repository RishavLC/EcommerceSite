import api from './api'

// ---- Categories ----
export async function fetchCategories(params) {
  const { data } = await api.get('/api/v1/admin/categories', { params })
  return data
}
export async function fetchCategory(id) {
  const { data } = await api.get(`/api/v1/admin/categories/${id}`)
  return data.data
}
export async function createCategory(payload) {
  const { data } = await api.post('/api/v1/admin/categories', payload)
  return data.data
}
export async function updateCategory(id, payload) {
  const { data } = await api.put(`/api/v1/admin/categories/${id}`, payload)
  return data.data
}
export async function deleteCategory(id) {
  await api.delete(`/api/v1/admin/categories/${id}`)
}
export async function toggleCategoryActive(id) {
  const { data } = await api.post(`/api/v1/admin/categories/${id}/toggle-active`)
  return data.data
}

// ---- Subcategories ----
export async function fetchSubcategories(params) {
  const { data } = await api.get('/api/v1/admin/subcategories', { params })
  return data
}
export async function fetchSubcategory(id) {
  const { data } = await api.get(`/api/v1/admin/subcategories/${id}`)
  return data.data
}
export async function createSubcategory(payload) {
  const { data } = await api.post('/api/v1/admin/subcategories', payload)
  return data.data
}
export async function updateSubcategory(id, payload) {
  const { data } = await api.put(`/api/v1/admin/subcategories/${id}`, payload)
  return data.data
}
export async function deleteSubcategory(id) {
  await api.delete(`/api/v1/admin/subcategories/${id}`)
}
export async function toggleSubcategoryActive(id) {
  const { data } = await api.post(`/api/v1/admin/subcategories/${id}/toggle-active`)
  return data.data
}

// ---- Brands ----
export async function fetchBrands(params) {
  const { data } = await api.get('/api/v1/admin/brands', { params })
  return data
}
export async function fetchBrand(id) {
  const { data } = await api.get(`/api/v1/admin/brands/${id}`)
  return data.data
}
export async function createBrand(payload) {
  const { data } = await api.post('/api/v1/admin/brands', payload)
  return data.data
}
export async function updateBrand(id, payload) {
  const { data } = await api.put(`/api/v1/admin/brands/${id}`, payload)
  return data.data
}
export async function deleteBrand(id) {
  await api.delete(`/api/v1/admin/brands/${id}`)
}
export async function toggleBrandActive(id) {
  const { data } = await api.post(`/api/v1/admin/brands/${id}/toggle-active`)
  return data.data
}
