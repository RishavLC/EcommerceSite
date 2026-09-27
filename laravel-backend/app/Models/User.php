<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Kept intentionally minimal in Phase 1 (Laravel's default fields only).
 *
 * Phase 2 extends this with phone, profile_image, address_id, status and
 * the related fillable/casts entries, plus registration/login logic.
 *
 * Phase 3 adds hasRole()/hasAnyRole() backed by a roles/role_user schema
 * (the role middleware in app/Http/Middleware already expects this method
 * to exist by then).
 *
 * Phase 7 adds the sellerProfile() relationship so a single user can be
 * both a buyer and, once approved, a seller.
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'profile_image',
        'address_line',
        'city',
        'province',
        'postal_code',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Phase 3: real roles/role_user backed checks (replaces the Phase 1 stub).
    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Role::class);
    }

    public function hasRole(string $slug): bool
    {
        return $this->roles->contains('slug', $slug);
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->roles->pluck('slug')->intersect($roles)->isNotEmpty();
    }

    public function hasPermission(string $slug): bool
    {
        return $this->roles->flatMap(fn ($role) => $role->permissions)->contains('slug', $slug);
    }

    // Phase 4 relationships
    public function sellerProfile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\SellerProfile::class);
    }

    public function products(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Product::class, 'seller_id');
    }

    public function addresses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Address::class);
    }

    public function cart(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\Cart::class);
    }

    public function wishlist(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\Wishlist::class);
    }

    public function orders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Order::class, 'buyer_id');
    }
}
