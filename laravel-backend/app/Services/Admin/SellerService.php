<?php

namespace App\Services\Admin;

use App\Models\Role;
use App\Models\SellerProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class SellerService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return SellerProfile::with('user:id,name,email')
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('store_name', 'like', "%{$s}%"))
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function approve(SellerProfile $profile): SellerProfile
    {
        $this->assertStatus($profile, ['pending']);

        $profile->update(['status' => 'approved', 'approved_at' => now(), 'rejection_reason' => null]);

        $sellerRole = Role::where('slug', 'seller')->first();
        if ($sellerRole) {
            $profile->user->roles()->syncWithoutDetaching($sellerRole);
        }

        return $profile->fresh('user');
    }

    public function reject(SellerProfile $profile, string $reason): SellerProfile
    {
        $this->assertStatus($profile, ['pending']);

        $profile->update(['status' => 'rejected', 'rejection_reason' => $reason]);

        return $profile->fresh('user');
    }

    public function suspend(SellerProfile $profile): SellerProfile
    {
        $this->assertStatus($profile, ['approved']);

        $profile->update(['status' => 'suspended']);

        return $profile->fresh('user');
    }

    public function activate(SellerProfile $profile): SellerProfile
    {
        $this->assertStatus($profile, ['suspended']);

        $profile->update(['status' => 'approved']);

        return $profile->fresh('user');
    }

    protected function assertStatus(SellerProfile $profile, array $allowed): void
    {
        if (! in_array($profile->status, $allowed)) {
            throw ValidationException::withMessages([
                'status' => ["This action isn't valid for a seller with status '{$profile->status}'."],
            ]);
        }
    }
}
