<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'products_count' => Product::count(),
            'orders_count' => Order::count(),
            'users_count' => User::where('role', 'customer')->count(),
            'revenue_total' => (float) Order::where('payment_status', 'paid')->sum('total'),
            'orders_by_status' => Order::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'recent_orders' => Order::with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
        ]);
    }
}
