import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { fetchDashboardStats, fetchDashboardCharts } from '../../services/adminService'
import StatCard from '../../components/admin/StatCard'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [charts, setCharts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchDashboardCharts()])
      .then(([statsData, chartsData]) => {
        setStats(statsData)
        setCharts(chartsData)
      })
      .catch(() => setError('Could not load dashboard data.'))
  }, [])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!stats || !charts) return <p className="text-sm text-slate-500">Loading dashboard...</p>

  const statCards = [
    ['Total Users', stats.total_users],
    ['Total Buyers', stats.total_buyers],
    ['Total Sellers', stats.total_sellers],
    ['Total Products', stats.total_products],
    ['Total Orders', stats.total_orders],
    ['Pending Orders', stats.pending_orders],
    ['Completed Orders', stats.completed_orders],
    ['Cancelled Orders', stats.cancelled_orders],
    ['Total Revenue', `Rs. ${stats.total_revenue.toLocaleString()}`],
    ['Pending Payouts', `Rs. ${stats.pending_seller_payouts.toLocaleString()}`],
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium text-slate-600">Daily Sales (last 7 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.daily_sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#1e293b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium text-slate-600">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.monthly_sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#334155" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium text-slate-600">Top Products</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.top_products} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="total_sold" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium text-slate-600">Top Sellers</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.top_sellers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="total_earning" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium text-slate-600">Category Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.category_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#b45309" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-medium text-slate-600">New Users (last 7 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.new_users}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#be123c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
