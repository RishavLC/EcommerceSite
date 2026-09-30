<?php

namespace App\Services\Seller;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\SellerPayout;

class DashboardService
{
    public function stats(int $sellerId): array
    {
        $items = OrderItem::where('seller_id', $sellerId);

        return [
            'total_products' => Product::where('seller_id', $sellerId)->count(),
            'total_orders' => (clone $items)->distinct('order_id')->count('order_id'),
            'total_sales' => (int) (clone $items)->sum('quantity'),
            'total_revenue' => (float) (clone $items)->sum('seller_earning'),
            'pending_orders' => (clone $items)->where('status', 'pending')->count(),
            'completed_orders' => (clone $items)->where('status', 'delivered')->count(),
            'low_stock_products' => Product::where('seller_id', $sellerId)
                ->whereRaw('(stock - reserved_stock) <= ?', [Product::LOW_STOCK_THRESHOLD])
                ->whereRaw('(stock - reserved_stock) > 0')
                ->count(),
            'average_rating' => round((float) Review::whereHas('product', fn ($q) => $q->where('seller_id', $sellerId))
                ->avg('rating'), 1),
            'pending_payouts' => (float) SellerPayout::where('seller_id', $sellerId)
                ->where('status', 'pending')
                ->sum('amount'),
        ];
    }
}
