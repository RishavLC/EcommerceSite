<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\RoleController;
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
