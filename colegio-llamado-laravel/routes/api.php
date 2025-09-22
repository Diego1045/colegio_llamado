<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EstudianteController;
use App\Http\Controllers\Api\RegistroSalidaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas públicas (sin autenticación)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/validate-code', [AuthController::class, 'validateInvitationCode']);
});

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    
    // Autenticación
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Estudiantes
    Route::apiResource('estudiantes', EstudianteController::class);

    // Registros de salida
    Route::apiResource('registros-salida', RegistroSalidaController::class);
    Route::patch('registros-salida/{id}/status', [RegistroSalidaController::class, 'updateStatus']);

    // Rutas adicionales que se pueden implementar después
    Route::prefix('admin')->middleware('admin')->group(function () {
        // Estas rutas requieren rol de admin
        // Se pueden implementar controladores adicionales aquí
    });
});

// Ruta de prueba
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API funcionando correctamente',
        'timestamp' => now()->toISOString(),
    ]);
});