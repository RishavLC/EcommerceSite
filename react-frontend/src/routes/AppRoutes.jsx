import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import SellerLayout from '../layouts/SellerLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import ComingSoon from '../components/common/ComingSoon'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import SellerApply from '../pages/seller/Apply'
import AdminDashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import UserForm from '../pages/admin/UserForm'
import UserDetail from '../pages/admin/UserDetail'
import Sellers from '../pages/admin/Sellers'
import SellerDetail from '../pages/admin/SellerDetail'
import Categories from '../pages/admin/Categories'
import CategoryForm from '../pages/admin/CategoryForm'
import Subcategories from '../pages/admin/Subcategories'
import SubcategoryForm from '../pages/admin/SubcategoryForm'
import Brands from '../pages/admin/Brands'
import BrandForm from '../pages/admin/BrandForm'
import AdminProducts from '../pages/admin/Products'
import AdminProductDetail from '../pages/admin/ProductDetail'
import SellerDashboard from '../pages/seller/Dashboard'
import SellerStoreProfile from '../pages/seller/StoreProfile'
import SellerProducts from '../pages/seller/Products'
import SellerProductForm from '../pages/seller/ProductForm'

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
        <Route
          path="/become-a-seller"
          element={
            <ProtectedRoute>
              <SellerApply />
            </ProtectedRoute>
          }
        />
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
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/:id/edit" element={<UserForm />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="sellers/:id" element={<SellerDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />
        <Route path="subcategories" element={<Subcategories />} />
        <Route path="subcategories/new" element={<SubcategoryForm />} />
        <Route path="subcategories/:id/edit" element={<SubcategoryForm />} />
        <Route path="brands" element={<Brands />} />
        <Route path="brands/new" element={<BrandForm />} />
        <Route path="brands/:id/edit" element={<BrandForm />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:id" element={<AdminProductDetail />} />
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

      {/* Seller */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/new" element={<SellerProductForm />} />
        <Route path="products/:id/edit" element={<SellerProductForm />} />
        <Route path="inventory" element={<ComingSoon title="Inventory" phase="Phase 11" />} />
        <Route path="orders" element={<ComingSoon title="Orders" phase="Phase 20" />} />
        <Route path="customers" element={<ComingSoon title="Customers" phase="Phase 20" />} />
        <Route path="reviews" element={<ComingSoon title="Reviews" phase="Phase 23" />} />
        <Route path="coupons" element={<ComingSoon title="Coupons" phase="Phase 24" />} />
        <Route path="earnings" element={<ComingSoon title="Earnings" phase="Phase 22" />} />
        <Route path="payouts" element={<ComingSoon title="Payouts" phase="Phase 22" />} />
        <Route path="store-profile" element={<SellerStoreProfile />} />
        <Route path="store-settings" element={<ComingSoon title="Store Settings" phase="Phase 29" />} />
      </Route>
    </Routes>
  )
}
