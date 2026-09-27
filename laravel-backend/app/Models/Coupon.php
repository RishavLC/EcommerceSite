<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'seller_id', 'discount_type', 'discount_amount', 'min_order_amount',
        'max_discount_amount', 'expires_at', 'usage_limit', 'used_count', 'is_active',
    ];
    protected $casts = ['expires_at' => 'datetime', 'is_active' => 'boolean'];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }
}
