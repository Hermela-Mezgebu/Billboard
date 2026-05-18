<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // ✅ 1. Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // ✅ 2. Check if user has one of the allowed roles
        if (!in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'Forbidden - Access denied'
            ], 403);
        }

        // ✅ 3. Allow request
        return $next($request);
    }
}