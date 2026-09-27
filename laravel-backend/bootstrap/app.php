<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Required for Sanctum SPA (cookie-based) authentication.
        $middleware->statefulApi();

        // Global API middleware stack.
        $middleware->api(prepend: [
            \App\Http\Middleware\ForceJsonResponse::class,
        ]);

        // Named middleware aliases used across the app (roles, ownership, etc.)
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureUserHasRole::class,
            'seller.approved' => \App\Http\Middleware\EnsureSellerIsApproved::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Always return JSON for API exceptions instead of Laravel's default HTML pages.
        $exceptions->shouldRenderJsonWhen(function ($request, $throwable) {
            return $request->is('api/*') || $request->expectsJson();
        });
    })->create();
