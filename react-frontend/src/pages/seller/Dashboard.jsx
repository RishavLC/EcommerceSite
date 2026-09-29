import { useEffect, useState } from 'react'
import { fetchSellerStats } from '../../services/sellerService'
import StatCard from '../../components/common/StatCard'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSellerStats().then(setStats).catch(() => setError('Could not load dashboard data.'))
  }, [])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!stats) return <p className="text-sm text-slate-500">Loading dashboard...</p>

  const statCards = [
    ['Total Products', stats.total_products],
    ['Total Orders', stats.total_orders],
    ['Total Sales (units)', stats.total_sales],
    ['Total Revenue', `Rs. ${stats.total_revenue.toLocaleString()}`],
    ['Pending Orders', stats.pending_orders],
    ['Completed Orders', stats.completed_orders],
    ['Low Stock Products', stats.low_stock_products],
    ['Average Rating', stats.average_rating || '-'],
    ['Pending Payouts', `Rs. ${stats.pending_payouts.toLocaleString()}`],
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">Seller Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {statCards.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>
      <p className="text-sm text-slate-500">
        Numbers will stay at zero until Phase 10 (Products) and Phase 19 (Checkout) add real products and orders.
      </p>
    </div>
  )
}
