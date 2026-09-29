<?php

use App\Http\Controllers\Api\Buyer\SellerApplicationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Buyer Routes
|--------------------------------------------------------------------------
|
| Sits behind auth:sanctum (see routes/api.php) - any authenticated user
| is a buyer by default. Cart, wishlist, addresses, checkout, orders,
| reviews, support tickets, etc. get added here from Phase 16+.
|
*/

// Phase 7: any authenticated user (buyer) can apply to become a seller.
Route::post('/seller-application', [SellerApplicationController::class, 'store']);
Route::get('/seller-application', [SellerApplicationController::class, 'show']);
