// Phase 2: real implementations against routes/api/auth.php on the backend.
import api, { ensureCsrfCookie } from './api'

export async function login(credentials) {
  await ensureCsrfCookie()
  const { data } = await api.post('/api/v1/auth/login', credentials)
  return data.data
}

export async function register(payload) {
  await ensureCsrfCookie()
  const { data } = await api.post('/api/v1/auth/register', payload)
  return data.data
}

export async function logout() {
  await api.post('/api/v1/auth/logout')
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/api/v1/me')
  return data.data
}

export async function forgotPassword(email) {
  await ensureCsrfCookie()
  const { data } = await api.post('/api/v1/auth/forgot-password', { email })
  return data
}

export async function resetPassword(payload) {
  await ensureCsrfCookie()
  const { data } = await api.post('/api/v1/auth/reset-password', payload)
  return data
}

export async function changePassword(payload) {
  const { data } = await api.put('/api/v1/auth/change-password', payload)
  return data
}

export async function updateProfile(payload) {
  const { data } = await api.put('/api/v1/auth/profile', payload)
  return data.data
}
