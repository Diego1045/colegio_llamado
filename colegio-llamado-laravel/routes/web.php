<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Colegio Llamado Backend API',
        'version' => '1.0.0',
        'status' => 'active'
    ]);
});