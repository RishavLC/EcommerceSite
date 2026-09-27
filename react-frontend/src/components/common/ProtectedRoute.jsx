import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, roles } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles?.length && !roles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />
  }

  return children
}
