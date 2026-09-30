<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectProductRequest;
use App\Models\Product;
use App\Services\Admin\ProductService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function __construct(protected ProductService $productService) {}

    public function index(Request $request)
    {
        return $this->paginated(
            $this->productService->list($request->only('search', 'status', 'seller_id', 'category_id', 'per_page'))
        );
    }

    public function show(Product $product)
    {
        return $this->success($product->load(['images', 'variants', 'attributes', 'seller', 'category', 'subcategory', 'brand']));
    }

    public function approve(Product $product)
    {
        try {
            return $this->success($this->productService->approve($product), 'Product approved.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }

    public function reject(RejectProductRequest $request, Product $product)
    {
        try {
            $result = $this->productService->reject($product, $request->validated()['rejection_reason']);

            return $this->success($result, 'Product rejected.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }

    public function toggleActive(Product $product)
    {
        try {
            return $this->success($this->productService->toggleActive($product), 'Status updated.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }
}
