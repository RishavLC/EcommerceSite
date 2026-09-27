<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts seller routes to users whose seller_profiles.status = approved.
 *
 * NOTE: This is a Phase 1 placeholder. The seller_profiles table and the
 * User::sellerProfile() relationship are built out in Phase 7 - until then
 * this denies access by default rather than silently allowing it.
 */
class EnsureSellerIsApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! method_exists($user, 'sellerProfile') || ! $user->sellerProfile?->isApproved()) {
            return response()->json([
                'success' => false,
                'message' => 'Your seller account is not approved yet.',
            ], 403);
        }

        return $next($request);
    }
}
