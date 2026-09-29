<?php

namespace App\Services\Seller;

use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SellerApplicationService
{
    public function apply(User $user, array $data): SellerProfile
    {
        $existing = $user->sellerProfile;

        if ($existing && in_array($existing->status, ['pending', 'approved', 'suspended'])) {
            throw ValidationException::withMessages([
                'store_name' => ["You already have a seller application with status '{$existing->status}'."],
            ]);
        }

        $data['user_id'] = $user->id;
        $data['status'] = 'pending';
        $data['rejection_reason'] = null;
        $data['approved_at'] = null;

        if ($existing) {
            // Reapplying after a rejection - reuse the same profile row and slug.
            $existing->update($data);

            return $existing->fresh();
        }

        $data['store_slug'] = $this->uniqueSlug($data['store_name']);

        return SellerProfile::create($data);
    }

    protected function uniqueSlug(string $storeName): string
    {
        $base = Str::slug($storeName);
        $slug = $base;
        $i = 1;

        while (SellerProfile::where('store_slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
