<?php

use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here are automatically prefixed with /api. We further group
| everything under /v1 so the API can be versioned later without breaking
| existing frontend/mobile clients.
|
| Route groups below are placeholders wired up phase by phase:
|   - Phase 2 fills in routes/api/auth.php
|   - Phase 6/7 fill in admin user & seller management routes
|   - Phase 10+ fill in product, cart, order, etc. routes
|
*/

Route::prefix('v1')->group(function () {

    // Simple unauthenticated health/ping check for frontend<->backend wiring.
    Route::get('/ping', function () {
        return response()->json([
            'success' => true,
            'message' => 'Marketplace API is reachable.',
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    // --- Auth routes (built out in Phase 2) ---
    require __DIR__.'/api/auth.php';

    // --- Authenticated routes, gated by Sanctum ---
    Route::middleware('auth:sanctum')->group(function () {

        // Current authenticated user.
        Route::get('/me', [AuthController::class, 'me']);

        // Admin-only routes (Phase 5+).
        Route::prefix('admin')->middleware('role:admin')->group(function () {
            require __DIR__.'/api/admin.php';
        });

        // Seller routes, require an approved seller profile (Phase 7+).
        Route::prefix('seller')->middleware(['role:seller', 'seller.approved'])->group(function () {
            require __DIR__.'/api/seller.php';
        });

        // Buyer routes - any authenticated user (Phase 16+).
        Route::prefix('buyer')->group(function () {
            require __DIR__.'/api/buyer.php';
        });
    });
});
