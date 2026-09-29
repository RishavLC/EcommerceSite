<?php

namespace App\Services\Buyer;

use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SellerApplicationService
{
    public function apply(User $user, array $data, UploadedFile $document): SellerProfile
    {
        $profile = $user->sellerProfile;

        // One application per user. Only a rejected one may be resubmitted.
        if ($profile && $profile->status !== 'rejected') {
            throw ValidationException::withMessages([
                'application' => ["You already have a seller application ({$profile->status})."],
            ]);
        }

        $attrs = Arr::except($data, ['verification_document']);
        $attrs['status'] = 'pending';
        $attrs['rejection_reason'] = null;

        // Verification documents are sensitive: private disk, never web-accessible.
        if ($profile?->verification_document) {
            Storage::disk('local')->delete($profile->verification_document);
        }
        $attrs['verification_document'] = $document->store('seller-documents', 'local');

        if ($profile) {
            $profile->update($attrs);

            return $profile->fresh();
        }

        $attrs['user_id'] = $user->id;
        $attrs['store_slug'] = $this->uniqueSlug($data['store_name']);

        return SellerProfile::create($attrs);
    }

    protected function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'store';
        $slug = $base;
        $i = 2;

        while (SellerProfile::withTrashed()->where('store_slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
