<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\AdjustStockRequest;
use App\Http\Requests\Seller\RestockRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InventoryController extends Controller
{
    public function __construct(protected InventoryService $inventoryService) {}

    public function index(Request $request)
    {
        $query = Product::where('seller_id', $request->user()->id)->with('variants');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->status === 'low_stock') {
            $query->whereRaw('(stock - reserved_stock) <= ?', [Product::LOW_STOCK_THRESHOLD])
                ->whereRaw('(stock - reserved_stock) > 0');
        } elseif ($request->status === 'out_of_stock') {
            $query->whereRaw('(stock - reserved_stock) <= 0');
        }

        return $this->paginated($query->latest()->paginate((int) $request->input('per_page', 15)));
    }

    public function restock(RestockRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $variant = $this->resolveVariant($product, $request->validated('variant_id'));

        try {
            $this->inventoryService->restock($product, $variant, $request->validated('quantity'), $request->validated('note'), $request->user());

            return $this->success($product->fresh(['variants']), 'Stock added.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }

    public function adjust(AdjustStockRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $variant = $this->resolveVariant($product, $request->validated('variant_id'));

        try {
            $this->inventoryService->adjust($product, $variant, $request->validated('delta'), $request->validated('note'), $request->user());

            return $this->success($product->fresh(['variants']), 'Stock adjusted.');
        } catch (ValidationException $e) {
            return $this->error(collect($e->errors())->flatten()->first(), 422, $e->errors());
        }
    }

    public function history(Request $request, Product $product)
    {
        $this->authorize('view', $product);

        $query = $product->stockHistories()->with('user:id,name')->latest();

        if ($request->filled('variant_id')) {
            $query->where('product_variant_id', $request->variant_id);
        }

        return $this->paginated($query->paginate((int) $request->input('per_page', 20)));
    }

    protected function resolveVariant(Product $product, ?int $variantId): ?ProductVariant
    {
        if (! $variantId) {
            return null;
        }

        return $product->variants()->findOrFail($variantId);
    }
}
