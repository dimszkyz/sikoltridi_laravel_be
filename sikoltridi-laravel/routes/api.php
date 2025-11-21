<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\PlanningController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{id}', [VideoController::class, 'show']);
// ... Route public lainnya (planning, organizing, dll)

// Protected Routes (Harus Login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/videos', [VideoController::class, 'store']);
    Route::post('/planning', [PlanningController::class, 'store']);
    // ... Route protected lainnya
    
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
});