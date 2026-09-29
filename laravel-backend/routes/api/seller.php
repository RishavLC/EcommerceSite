<?php

use App\Http\Controllers\Api\Seller\DashboardController;
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
