<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // `stock` (Phase 4) stays the count of sellable, unreserved units.
            $table->unsignedInteger('reserved_stock')->default(0)->after('stock');
            $table->unsignedInteger('sold_stock')->default(0)->after('reserved_stock');
            // Null = fall back to the platform default (see InventoryService::DEFAULT_LOW_STOCK_THRESHOLD).
            $table->unsignedInteger('low_stock_threshold')->nullable()->after('sold_stock');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['reserved_stock', 'sold_stock', 'low_stock_threshold']);
        });
    }
};
