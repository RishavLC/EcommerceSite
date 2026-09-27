import api from './api'

export async function fetchDashboardStats() {
  const { data } = await api.get('/api/v1/admin/dashboard/stats')
  return data.data
}

export async function fetchDashboardCharts() {
  const { data } = await api.get('/api/v1/admin/dashboard/charts')
  return data.data
}
