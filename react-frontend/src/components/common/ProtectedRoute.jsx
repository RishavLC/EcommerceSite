import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, roles, loading } = useAuth()

  // Wait for the initial /me check, otherwise a page refresh looks "logged out".
  if (loading) return <p className="p-6 text-sm text-slate-500">Loading...</p>

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles?.length && !roles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />
  }

  return children
}
