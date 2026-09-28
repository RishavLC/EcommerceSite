import api from './api'

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
