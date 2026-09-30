<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->cascadeOnDelete();
            // restock | adjustment | reserved | released | sold | returned
            $table->string('type');
            $table->integer('quantity_change'); // signed: +5, -3, etc.
            $table->unsignedInteger('quantity_after'); // resulting stock value, for an audit trail
            $table->string('note')->nullable();
            // Null when the change was system-triggered (order lifecycle) rather than a manual seller action.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_histories');
    }
};
