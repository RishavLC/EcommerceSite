<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Every API request should behave as if it sent "Accept: application/json",
 * regardless of what the client actually sent. This keeps validation errors,
 * auth exceptions, and 404s consistently JSON instead of occasionally
 * falling back to Laravel's HTML error pages.
 */
class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
