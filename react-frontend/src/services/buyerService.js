import api from './api'

export async function fetchMySellerApplication() {
  const { data } = await api.get('/api/v1/buyer/seller-application')
  return data.data // null if the user hasn't applied
}

// payload is a FormData (includes the verification file)
export async function applyForSeller(formData) {
  const { data } = await api.post('/api/v1/buyer/seller-application', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}
