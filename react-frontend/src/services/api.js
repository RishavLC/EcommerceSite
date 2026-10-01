import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL,
  withCredentials: true, // required for Sanctum cookie-based SPA auth
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

// Ensures the CSRF cookie is set before any state-changing Sanctum request.
// Call once before login/register (Phase 2 wires this into authService).
export async function ensureCsrfCookie() {
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, { withCredentials: true })
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Phase 2: clear auth context / redirect to login here.
    }
    return Promise.reject(err)
  },
)

export default api
