<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\StoreProductRequest;
use App\Http\Requests\Seller\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\Seller\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(protected ProductService $productService) {}

    public function index(Request $request)
    {
        return $this->paginated(
            $this->productService->list($request->user()->id, $request->only('search', 'status', 'per_page'))
        );
    }

    public function store(StoreProductRequest $request)
    {
        $product = $this->productService->create(
            $request->user()->id,
            $request->validated(),
            $request->file('images', [])
        );

        return $this->success($product, 'Product created.', 201);
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);

        return $this->success($product->load(['images', 'variants', 'attributes', 'category', 'subcategory', 'brand']));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $updated = $this->productService->update($product, $request->validated(), $request->file('images', []));

        return $this->success($updated, 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $this->productService->delete($product);

        return $this->success(null, 'Product deleted.');
    }

    public function addImage(Request $request, Product $product)
    {
        $this->authorize('update', $product);
        $request->validate(['image' => ['required', 'image', 'max:2048']]);

        $image = $this->productService->addImage($product, $request->file('image'));

        return $this->success($image, 'Image added.', 201);
    }

    public function deleteImage(Product $product, ProductImage $image)
    {
        $this->authorize('update', $product);

        $this->productService->deleteImage($product, $image);

        return $this->success(null, 'Image removed.');
    }
}
