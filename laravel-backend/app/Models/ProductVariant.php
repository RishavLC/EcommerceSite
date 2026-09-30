<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'sku', 'attributes', 'price', 'stock', 'reserved_stock', 'sold_stock', 'image'];
    protected $appends = ['available_stock'];
    protected $casts = ['attributes' => 'array', 'price' => 'decimal:2'];

    public function getAvailableStockAttribute(): int
    {
        return max(0, $this->stock - $this->reserved_stock);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
