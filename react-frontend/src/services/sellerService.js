import api from './api'

export async function applyAsSeller(payload) {
  const { data } = await api.post('/api/v1/buyer/seller-application', payload)
  return data.data
}

export async function fetchMySellerApplication() {
  const { data } = await api.get('/api/v1/buyer/seller-application')
  return data.data
}
