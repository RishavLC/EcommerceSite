<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerPayout extends Model
{
    protected $fillable = [
        'seller_id', 'amount', 'status', 'period_start', 'period_end', 'paid_at', 'reference',
    ];
    protected $casts = ['period_start' => 'date', 'period_end' => 'date', 'paid_at' => 'datetime'];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
