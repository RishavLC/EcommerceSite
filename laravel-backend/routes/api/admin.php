<?php

use App\Http\Controllers\Api\Admin\BrandController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\SellerController;
use App\Http\Controllers\Api\Admin\SubcategoryController;
use App\Http\Controllers\Api\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Sits behind auth:sanctum + role:admin (see routes/api.php).
|
*/

Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
Route::get('/dashboard/charts', [DashboardController::class, 'charts']);

Route::get('/roles', [RoleController::class, 'index']);

// Users (Phase 6)
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::put('/users/{user}', [UserController::class, 'update']);
Route::post('/users/{user}/activate', [UserController::class, 'activate']);
Route::post('/users/{user}/deactivate', [UserController::class, 'deactivate']);
Route::get('/users/{user}/orders', [UserController::class, 'orders']);
Route::post('/users/{user}/roles/assign', [RoleController::class, 'assign']);
Route::post('/users/{user}/roles/revoke', [RoleController::class, 'revoke']);

// Sellers (Phase 7)
Route::get('/sellers', [SellerController::class, 'index']);
Route::get('/sellers/{seller}', [SellerController::class, 'show']);
Route::post('/sellers/{seller}/approve', [SellerController::class, 'approve']);
Route::post('/sellers/{seller}/reject', [SellerController::class, 'reject']);
Route::post('/sellers/{seller}/suspend', [SellerController::class, 'suspend']);
Route::post('/sellers/{seller}/activate', [SellerController::class, 'activate']);

// Categories (Phase 9)
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::put('/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
Route::post('/categories/{category}/toggle-active', [CategoryController::class, 'toggleActive']);

// Subcategories (Phase 9)
Route::get('/subcategories', [SubcategoryController::class, 'index']);
Route::post('/subcategories', [SubcategoryController::class, 'store']);
Route::get('/subcategories/{subcategory}', [SubcategoryController::class, 'show']);
Route::put('/subcategories/{subcategory}', [SubcategoryController::class, 'update']);
Route::delete('/subcategories/{subcategory}', [SubcategoryController::class, 'destroy']);
Route::post('/subcategories/{subcategory}/toggle-active', [SubcategoryController::class, 'toggleActive']);

// Brands (Phase 9)
Route::get('/brands', [BrandController::class, 'index']);
Route::post('/brands', [BrandController::class, 'store']);
Route::get('/brands/{brand}', [BrandController::class, 'show']);
Route::put('/brands/{brand}', [BrandController::class, 'update']);
Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);
Route::post('/brands/{brand}/toggle-active', [BrandController::class, 'toggleActive']);

// Products (Phase 10)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::post('/products/{product}/approve', [ProductController::class, 'approve']);
Route::post('/products/{product}/reject', [ProductController::class, 'reject']);
Route::post('/products/{product}/toggle-active', [ProductController::class, 'toggleActive']);
