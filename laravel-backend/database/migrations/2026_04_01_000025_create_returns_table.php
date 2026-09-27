<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained('order_items')->cascadeOnDelete();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->string('reason');
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['requested', 'approved', 'rejected', 'pickup', 'received', 'refunded'])->default('requested');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('returns'); }
};
