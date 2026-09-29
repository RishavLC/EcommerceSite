import api from './api'

// ---- Dashboard (Phase 5) ----
export async function fetchDashboardStats() {
  const { data } = await api.get('/api/v1/admin/dashboard/stats')
  return data.data
}

export async function fetchDashboardCharts() {
  const { data } = await api.get('/api/v1/admin/dashboard/charts')
  return data.data
}

// ---- Users (Phase 6) ----
export async function fetchRoles() {
  const { data } = await api.get('/api/v1/admin/roles')
  return data.data
}

export async function fetchUsers(params) {
  const { data } = await api.get('/api/v1/admin/users', { params })
  return data // { data: [...], meta: {...} }
}

export async function fetchUser(id) {
  const { data } = await api.get(`/api/v1/admin/users/${id}`)
  return data.data
}

export async function createUser(payload) {
  const { data } = await api.post('/api/v1/admin/users', payload)
  return data.data
}

export async function updateUser(id, payload) {
  const { data } = await api.put(`/api/v1/admin/users/${id}`, payload)
  return data.data
}

export async function setUserActive(id, active) {
  const action = active ? 'activate' : 'deactivate'
  const { data } = await api.post(`/api/v1/admin/users/${id}/${action}`)
  return data.data
}

export async function fetchUserOrders(id) {
  const { data } = await api.get(`/api/v1/admin/users/${id}/orders`)
  return data
}

// ---- Sellers (Phase 7) ----
export async function fetchSellers(params) {
  const { data } = await api.get('/api/v1/admin/sellers', { params })
  return data
}

export async function fetchSeller(id) {
  const { data } = await api.get(`/api/v1/admin/sellers/${id}`)
  return data.data
}

export async function approveSeller(id) {
  const { data } = await api.post(`/api/v1/admin/sellers/${id}/approve`)
  return data.data
}

export async function rejectSeller(id, reason) {
  const { data } = await api.post(`/api/v1/admin/sellers/${id}/reject`, { rejection_reason: reason })
  return data.data
}

export async function suspendSeller(id) {
  const { data } = await api.post(`/api/v1/admin/sellers/${id}/suspend`)
  return data.data
}

export async function activateSeller(id) {
  const { data } = await api.post(`/api/v1/admin/sellers/${id}/activate`)
  return data.data
}
