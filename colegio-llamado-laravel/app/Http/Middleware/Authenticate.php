<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Para APIs siempre devolver null (no redirigir)
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        // Para web, podrías crear una ruta de login más adelante
        return null;
    }
}