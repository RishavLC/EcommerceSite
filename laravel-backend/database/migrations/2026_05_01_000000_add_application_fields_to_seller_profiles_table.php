<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('seller_profiles', function (Blueprint $table) {
            $table->string('full_name')->nullable()->after('user_id');
            $table->string('verification_type')->nullable()->after('postal_code'); // citizenship | pan | business_registration
            $table->string('verification_number')->nullable()->after('verification_type');
            $table->string('verification_document')->nullable()->after('verification_number'); // private disk path
        });
    }
    public function down(): void {
        Schema::table('seller_profiles', function (Blueprint $table) {
            $table->dropColumn(['full_name', 'verification_type', 'verification_number', 'verification_document']);
        });
    }
};
