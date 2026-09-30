import api from './api'

export async function fetchInventory(params) {
  const { data } = await api.get('/api/v1/seller/inventory', { params })
  return data
}

export async function restockProduct(productId, payload) {
  const { data } = await api.post(`/api/v1/seller/inventory/${productId}/restock`, payload)
  return data.data
}

export async function adjustStock(productId, payload) {
  const { data } = await api.post(`/api/v1/seller/inventory/${productId}/adjust`, payload)
  return data.data
}

export async function fetchStockHistory(productId, params) {
  const { data } = await api.get(`/api/v1/seller/inventory/${productId}/history`, { params })
  return data
}
