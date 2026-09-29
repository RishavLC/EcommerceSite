<?php

namespace App\Services\Admin;

use App\Models\Brand;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class BrandService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Brand::withCount('products')
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when(isset($filters['status']), fn ($q) => $q->where('is_active', $filters['status'] === 'active'))
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(array $data): Brand
    {
        $data['slug'] = $this->uniqueSlug($data['name']);

        return Brand::create($data);
    }

    public function update(Brand $brand, array $data): Brand
    {
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = $this->uniqueSlug($data['name'], $brand->id);
        }

        $brand->update($data);

        return $brand->fresh();
    }

    public function delete(Brand $brand): void
    {
        // Brands have no SoftDeletes column (Phase 4); products.brand_id is
        // nullOnDelete, so a hard delete here is safe and doesn't orphan rows.
        $brand->delete();
    }

    public function toggleActive(Brand $brand): Brand
    {
        $brand->update(['is_active' => ! $brand->is_active]);

        return $brand->fresh();
    }

    protected function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Brand::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
