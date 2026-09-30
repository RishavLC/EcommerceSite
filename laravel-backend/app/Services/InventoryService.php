<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockHistory;
use App\Models\User;
use Illuminate\Validation\ValidationException;

/**
 * Central place that ever touches stock/reserved_stock/sold_stock, so every
 * change - manual (this phase) or order-driven (Phase 19/20/25 later) -
 * goes through the same logging and the same guard against negative stock.
 *
 * Operates on either a Product or one of its ProductVariants by accepting
 * both and using whichever is non-null; callers pass $product always (for
 * the stock_histories.product_id column) and $variant only when the line
 * being adjusted is a specific variant.
 */
class InventoryService
{
    public function restock(Product $product, ?ProductVariant $variant, int $quantity, ?string $note, ?User $actor): void
    {
        if ($quantity <= 0) {
            throw ValidationException::withMessages(['quantity' => ['Restock quantity must be greater than zero.']]);
        }

        $this->applyDelta($product, $variant, $quantity, 'restock', $note, $actor);
    }

    public function adjust(Product $product, ?ProductVariant $variant, int $delta, string $note, ?User $actor): void
    {
        if ($delta === 0) {
            throw ValidationException::withMessages(['delta' => ['Adjustment must not be zero.']]);
        }

        $this->applyDelta($product, $variant, $delta, 'adjustment', $note, $actor);
    }

    /** Called when an order is placed - holds stock without removing it from stock yet. */
    public function reserve(Product $product, ?ProductVariant $variant, int $quantity): void
    {
        $target = $variant ?? $product;

        if ($target->available_stock < $quantity) {
            throw ValidationException::withMessages(['quantity' => ['Not enough available stock to reserve.']]);
        }

        $target->increment('reserved_stock', $quantity);
        $this->log($product, $variant, 'reserved', -$quantity, null);
    }

    /** Called when a reserved (unfulfilled) order is cancelled. */
    public function release(Product $product, ?ProductVariant $variant, int $quantity): void
    {
        $target = $variant ?? $product;
        $target->decrement('reserved_stock', min($quantity, $target->reserved_stock));
        $this->log($product, $variant, 'released', $quantity, null);
    }

    /** Called when a reserved order is actually fulfilled/delivered - leaves stock for good. */
    public function fulfill(Product $product, ?ProductVariant $variant, int $quantity): void
    {
        $target = $variant ?? $product;
        $target->decrement('stock', min($quantity, $target->stock));
        $target->decrement('reserved_stock', min($quantity, $target->reserved_stock));
        $target->increment('sold_stock', $quantity);
        $this->log($product, $variant, 'sold', -$quantity, null);
    }

    /** Called when a delivered order is returned/refunded - the physical item comes back. */
    public function returnStock(Product $product, ?ProductVariant $variant, int $quantity): void
    {
        $target = $variant ?? $product;
        $target->increment('stock', $quantity);
        $target->decrement('sold_stock', min($quantity, $target->sold_stock));
        $this->log($product, $variant, 'returned', $quantity, null);
    }

    protected function applyDelta(Product $product, ?ProductVariant $variant, int $delta, string $type, ?string $note, ?User $actor): void
    {
        $target = $variant ?? $product;

        if ($target->stock + $delta < 0) {
            throw ValidationException::withMessages(['delta' => ['This would bring stock below zero.']]);
        }

        $target->increment('stock', $delta);
        $this->log($product, $variant, $type, $delta, $note, $actor);
    }

    protected function log(Product $product, ?ProductVariant $variant, string $type, int $quantityChange, ?string $note, ?User $actor = null): void
    {
        $quantityAfter = $variant ? $variant->fresh()->stock : $product->fresh()->stock;

        StockHistory::create([
            'product_id' => $product->id,
            'product_variant_id' => $variant?->id,
            'type' => $type,
            'quantity_change' => $quantityChange,
            'quantity_after' => $quantityAfter,
            'note' => $note,
            'user_id' => $actor?->id,
        ]);
    }
}
