<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\RoleController;
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
Route::post('/users/{user}/roles/assign', [RoleController::class, 'assign']);
Route::post('/users/{user}/roles/revoke', [RoleController::class, 'revoke']);

// User management (Phase 6), seller approval (Phase 7), catalog/product
// moderation, orders, reports etc. get added here phase by phase.
