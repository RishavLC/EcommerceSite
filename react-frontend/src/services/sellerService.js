import api from './api'

export async function applyAsSeller(payload) {
  const { data } = await api.post('/api/v1/buyer/seller-application', payload)
  return data.data
}

export async function fetchMySellerApplication() {
  const { data } = await api.get('/api/v1/buyer/seller-application')
  return data.data
}

// ---- Dashboard (Phase 8) ----
export async function fetchSellerStats() {
  const { data } = await api.get('/api/v1/seller/dashboard/stats')
  return data.data
}

// ---- Store profile (Phase 8) ----
export async function fetchStoreProfile() {
  const { data } = await api.get('/api/v1/seller/store-profile')
  return data.data
}

export async function updateStoreProfile(payload) {
  const { data } = await api.put('/api/v1/seller/store-profile', payload)
  return data.data
}
