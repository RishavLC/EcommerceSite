<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = ['payment_id', 'transaction_id', 'gateway', 'amount', 'status', 'meta'];
    protected $casts = ['meta' => 'array'];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
