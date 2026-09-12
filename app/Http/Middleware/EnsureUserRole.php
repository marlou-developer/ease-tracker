<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, $roles)) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized access.'], 403);
            }
            abort(403, 'Unauthorized access to portal.');
        }

        return $next($request);
    }
}
