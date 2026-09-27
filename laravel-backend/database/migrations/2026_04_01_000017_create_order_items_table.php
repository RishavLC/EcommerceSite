<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            // Denormalized so a multi-seller cart splits cleanly per seller.
            $table->foreignId('seller_id')->constrained('users')->restrictOnDelete();
            $table->unsignedInteger('quantity');
            $table->decimal('price', 12, 2); // unit price at time of order
            $table->decimal('commission_percent', 5, 2)->default(10);
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('seller_earning', 12, 2);
            $table->enum('status', [
                'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded',
            ])->default('pending');
            $table->timestamps();

            $table->index(['seller_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('order_items'); }
};
