<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Named ReturnRequest, not Return, since "return" is a reserved PHP keyword.
class ReturnRequest extends Model
{
    protected $table = 'returns';

    protected $fillable = ['order_item_id', 'buyer_id', 'reason', 'description', 'images', 'status'];
    protected $casts = ['images' => 'array'];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class, 'return_id');
    }
}
