<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This backend is a pure JSON API consumed by the React SPA (and later,
| a mobile app). We don't render Blade views here. This route only exists
| so hitting the backend root in a browser doesn't 404 confusingly, and
| Sanctum's /sanctum/csrf-cookie endpoint (registered by the Sanctum
| service provider) has a "web" middleware group to attach to.
|
*/

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
        'docs' => 'This is a JSON API. See /api/v1/ping and the frontend app.',
    ]);
});
