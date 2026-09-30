<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use SoftDeletes;

    public const LOW_STOCK_THRESHOLD = 10;

    protected $fillable = [
        'seller_id', 'category_id', 'subcategory_id', 'brand_id',
        'name', 'slug', 'sku', 'description', 'price', 'discount_price',
        'stock', 'reserved_stock', 'sold_stock', 'weight', 'dimensions',
        'status', 'rejection_reason',
    ];

    protected $appends = ['available_stock', 'is_low_stock', 'is_out_of_stock'];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
    ];

    public function getAvailableStockAttribute(): int
    {
        return max(0, $this->stock - $this->reserved_stock);
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->available_stock > 0 && $this->available_stock <= self::LOW_STOCK_THRESHOLD;
    }

    public function getIsOutOfStockAttribute(): bool
    {
        return $this->available_stock <= 0;
    }

    public function stockHistories(): HasMany
    {
        return $this->hasMany(StockHistory::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function attributes(): HasMany
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
