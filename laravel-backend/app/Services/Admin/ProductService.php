<?php

namespace App\Services\Admin;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class ProductService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Product::with(['seller:id,name', 'category:id,name', 'images'])
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->when($filters['seller_id'] ?? null, fn ($q, $id) => $q->where('seller_id', $id))
            ->when($filters['category_id'] ?? null, fn ($q, $id) => $q->where('category_id', $id))
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function approve(Product $product): Product
    {
        $this->assertStatus($product, ['pending']);

        $product->update(['status' => 'active', 'rejection_reason' => null]);

        return $product->fresh();
    }

    public function reject(Product $product, string $reason): Product
    {
        $this->assertStatus($product, ['pending']);

        $product->update(['status' => 'rejected', 'rejection_reason' => $reason]);

        return $product->fresh();
    }

    public function toggleActive(Product $product): Product
    {
        $this->assertStatus($product, ['active', 'inactive']);

        $product->update(['status' => $product->status === 'active' ? 'inactive' : 'active']);

        return $product->fresh();
    }

    protected function assertStatus(Product $product, array $allowed): void
    {
        if (! in_array($product->status, $allowed)) {
            throw ValidationException::withMessages([
                'status' => ["This action isn't valid for a product with status '{$product->status}'."],
            ]);
        }
    }
}
