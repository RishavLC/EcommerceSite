import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import Dashboard from '../pages/admin/Dashboard'
import ComingSoon from '../pages/admin/ComingSoon'
import Users from '../pages/admin/Users'
import UserForm from '../pages/admin/UserForm'
import UserDetail from '../pages/admin/UserDetail'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Storefront */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/:id/edit" element={<UserForm />} />
        <Route path="sellers" element={<ComingSoon title="Sellers" phase="Phase 7" />} />
        <Route path="categories" element={<ComingSoon title="Categories" phase="Phase 9" />} />
        <Route path="subcategories" element={<ComingSoon title="Subcategories" phase="Phase 9" />} />
        <Route path="brands" element={<ComingSoon title="Brands" phase="Phase 9" />} />
        <Route path="products" element={<ComingSoon title="Products" phase="Phase 10" />} />
        <Route path="orders" element={<ComingSoon title="Orders" phase="Phase 20" />} />
        <Route path="payments" element={<ComingSoon title="Payments" phase="Phase 21" />} />
        <Route path="coupons" element={<ComingSoon title="Coupons" phase="Phase 24" />} />
        <Route path="reviews" element={<ComingSoon title="Reviews" phase="Phase 23" />} />
        <Route path="returns" element={<ComingSoon title="Returns" phase="Phase 25" />} />
        <Route path="refunds" element={<ComingSoon title="Refunds" phase="Phase 25" />} />
        <Route path="reports" element={<ComingSoon title="Reports" phase="Phase 28" />} />
        <Route path="support-tickets" element={<ComingSoon title="Support Tickets" phase="Phase 27" />} />
        <Route path="settings" element={<ComingSoon title="Settings" phase="Phase 29" />} />
      </Route>

      {/* Phase 8: /seller/* (wrapped in ProtectedRoute allowedRoles={['seller']}) */}
    </Routes>
  )
}
