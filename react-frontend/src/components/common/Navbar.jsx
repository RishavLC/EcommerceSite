import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, roles, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-slate-800">Marketplace</Link>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <Link to="/">Home</Link>
          {roles.includes('admin') && <Link to="/admin">Admin</Link>}
          {isAuthenticated ? (
            <>
              <span>Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-slate-800 underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
