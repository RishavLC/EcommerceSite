<?php

namespace App\Services\Seller;

use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductService
{
    public function list(int $sellerId, array $filters): LengthAwarePaginator
    {
        return Product::where('seller_id', $sellerId)
            ->with(['category:id,name', 'images'])
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(int $sellerId, array $data, array $images = []): Product
    {
        $product = Product::create([
            'seller_id' => $sellerId,
            'category_id' => $data['category_id'],
            'subcategory_id' => $data['subcategory_id'] ?? null,
            'brand_id' => $data['brand_id'] ?? null,
            'name' => $data['name'],
            'slug' => $this->uniqueSlug($data['name']),
            'sku' => $data['sku'] ?? $this->generateSku($data['name']),
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'discount_price' => $data['discount_price'] ?? null,
            'stock' => $data['stock'],
            'weight' => $data['weight'] ?? null,
            'dimensions' => $data['dimensions'] ?? null,
            'status' => config('app.product_moderation_enabled') ? 'pending' : 'active',
        ]);

        $this->syncImages($product, $images);
        $this->syncVariants($product, $data['variants'] ?? []);
        $this->syncAttributes($product, $data['attributes'] ?? []);

        return $product->fresh(['images', 'variants', 'attributes']);
    }

    public function update(Product $product, array $data, array $images = []): Product
    {
        $updates = collect($data)->only([
            'category_id', 'subcategory_id', 'brand_id', 'name', 'sku',
            'description', 'price', 'discount_price', 'stock', 'weight', 'dimensions',
        ])->toArray();

        if (isset($updates['name'])) {
            $updates['slug'] = $this->uniqueSlug($updates['name'], $product->id);
        }

        $product->update($updates);

        if (! empty($images)) {
            $this->syncImages($product, $images);
        }

        if (array_key_exists('variants', $data)) {
            $this->syncVariants($product, $data['variants'] ?? []);
        }

        if (array_key_exists('attributes', $data)) {
            $this->syncAttributes($product, $data['attributes'] ?? []);
        }

        return $product->fresh(['images', 'variants', 'attributes']);
    }

    public function delete(Product $product): void
    {
        $product->delete(); // soft delete
    }

    public function addImage(Product $product, UploadedFile $file): ProductImage
    {
        $path = $file->store('products', 'public');
        $isPrimary = $product->images()->count() === 0;

        return $product->images()->create(['path' => $path, 'is_primary' => $isPrimary]);
    }

    public function deleteImage(Product $product, ProductImage $image): void
    {
        Storage::disk('public')->delete($image->path);
        $image->delete();
    }

    protected function syncImages(Product $product, array $files): void
    {
        foreach ($files as $i => $file) {
            $path = $file->store('products', 'public');
            $product->images()->create([
                'path' => $path,
                'is_primary' => $i === 0 && $product->images()->count() === 0,
                'sort_order' => $i,
            ]);
        }
    }

    protected function syncVariants(Product $product, array $variants): void
    {
        // Full replace - simpler and safe since variants have no order history yet.
        $product->variants()->delete();

        foreach ($variants as $variant) {
            $product->variants()->create([
                'sku' => $variant['sku'],
                'attributes' => $variant['attributes'],
                'price' => $variant['price'] ?? null,
                'stock' => $variant['stock'],
                'image' => $variant['image'] ?? null,
            ]);
        }
    }

    protected function syncAttributes(Product $product, array $attributes): void
    {
        $product->attributes()->delete();

        foreach ($attributes as $attribute) {
            $product->attributes()->create([
                'name' => $attribute['name'],
                'value' => $attribute['value'],
            ]);
        }
    }

    protected function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Product::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    protected function generateSku(string $name): string
    {
        $base = strtoupper(Str::slug($name, '-'));
        $sku = "{$base}-".strtoupper(Str::random(5));

        while (Product::where('sku', $sku)->exists()) {
            $sku = "{$base}-".strtoupper(Str::random(5));
        }

        return $sku;
    }
}
