<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SellerPayout;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function stats(): array
    {
        return [
            'total_users' => User::count(),
            'total_buyers' => User::whereHas('roles', fn ($q) => $q->where('slug', 'buyer'))->count(),
            'total_sellers' => User::whereHas('roles', fn ($q) => $q->where('slug', 'seller'))->count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'completed_orders' => Order::where('status', 'delivered')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_revenue' => (float) Order::whereNotIn('status', ['cancelled'])->sum('total'),
            'pending_seller_payouts' => (float) SellerPayout::where('status', 'pending')->sum('amount'),
        ];
    }

    public function charts(): array
    {
        return [
            'daily_sales' => $this->dailySales(),
            'monthly_sales' => $this->monthlySales(),
            'top_products' => $this->topProducts(),
            'top_sellers' => $this->topSellers(),
            'category_performance' => $this->categoryPerformance(),
            'new_users' => $this->newUsers(),
        ];
    }

    protected function dailySales(): array
    {
        return Order::selectRaw('DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue')
            ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->whereNotIn('status', ['cancelled'])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'orders' => (int) $row->orders,
                'revenue' => (float) $row->revenue,
            ])->toArray();
    }

    protected function monthlySales(): array
    {
        return Order::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as orders, SUM(total) as revenue")
            ->where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->whereNotIn('status', ['cancelled'])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'orders' => (int) $row->orders,
                'revenue' => (float) $row->revenue,
            ])->toArray();
    }

    protected function topProducts(int $limit = 5): array
    {
        return OrderItem::select('product_id')
            ->selectRaw('SUM(quantity) as total_sold, SUM(price * quantity) as total_revenue')
            ->with('product:id,name')
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'product_id' => $row->product_id,
                'name' => $row->product?->name,
                'total_sold' => (int) $row->total_sold,
                'total_revenue' => (float) $row->total_revenue,
            ])->toArray();
    }

    protected function topSellers(int $limit = 5): array
    {
        return OrderItem::select('seller_id')
            ->selectRaw('SUM(seller_earning) as total_earning, COUNT(DISTINCT order_id) as total_orders')
            ->with('seller:id,name')
            ->groupBy('seller_id')
            ->orderByDesc('total_earning')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'seller_id' => $row->seller_id,
                'name' => $row->seller?->name,
                'total_earning' => (float) $row->total_earning,
                'total_orders' => (int) $row->total_orders,
            ])->toArray();
    }

    protected function categoryPerformance(): array
    {
        return DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->selectRaw('categories.name as category, SUM(order_items.price * order_items.quantity) as revenue')
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($row) => [
                'category' => $row->category,
                'revenue' => (float) $row->revenue,
            ])->toArray();
    }

    protected function newUsers(): array
    {
        return User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => ['date' => $row->date, 'count' => (int) $row->count])
            ->toArray();
    }
}
