<?php

use App\Http\Controllers\Api\Seller\DashboardController;
use App\Http\Controllers\Api\Seller\ProductController;
use App\Http\Controllers\Api\Seller\StoreProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Seller Routes
|--------------------------------------------------------------------------
|
| Sits behind auth:sanctum + role:seller + seller.approved
| (see routes/api.php). Product/inventory management, orders, payouts,
| coupons, etc. get added here phase by phase.
|
*/

Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

Route::get('/store-profile', [StoreProfileController::class, 'show']);
Route::put('/store-profile', [StoreProfileController::class, 'update']);

// Products (Phase 10)
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::put('/products/{product}', [ProductController::class, 'update']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);
Route::post('/products/{product}/images', [ProductController::class, 'addImage']);
Route::delete('/products/{product}/images/{image}', [ProductController::class, 'deleteImage']);
