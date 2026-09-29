<?php

namespace App\Services\Admin;

use App\Models\Subcategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class SubcategoryService
{
    public function list(array $filters): LengthAwarePaginator
    {
        return Subcategory::with('category:id,name')
            ->withCount('products')
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($filters['category_id'] ?? null, fn ($q, $c) => $q->where('category_id', $c))
            ->when(isset($filters['status']), fn ($q) => $q->where('is_active', $filters['status'] === 'active'))
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(array $data): Subcategory
    {
        $data['slug'] = $this->uniqueSlug($data['name']);

        return Subcategory::create($data);
    }

    public function update(Subcategory $subcategory, array $data): Subcategory
    {
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = $this->uniqueSlug($data['name'], $subcategory->id);
        }

        $subcategory->update($data);

        return $subcategory->fresh();
    }

    public function delete(Subcategory $subcategory): void
    {
        $subcategory->delete(); // soft delete
    }

    public function toggleActive(Subcategory $subcategory): Subcategory
    {
        $subcategory->update(['is_active' => ! $subcategory->is_active]);

        return $subcategory->fresh();
    }

    protected function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Subcategory::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
