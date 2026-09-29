<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'full_name', 'store_name', 'store_slug', 'business_name', 'phone', 'description',
        'logo', 'cover_image', 'address_line', 'city', 'province', 'postal_code',
        'verification_type', 'verification_number', 'verification_document',
        'bank_account_name', 'bank_account_number', 'bank_name',
        'status', 'rejection_reason', 'approved_at',
    ];

    protected $casts = ['approved_at' => 'datetime'];

    // The private file path is never sent to the client; expose a flag instead.
    protected $hidden = ['verification_document'];
    protected $appends = ['has_document'];

    public function getHasDocumentAttribute(): bool
    {
        return ! empty($this->verification_document);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }
}
