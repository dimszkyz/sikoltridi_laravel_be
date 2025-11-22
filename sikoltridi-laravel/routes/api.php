<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\OrganizingController;
use App\Http\Controllers\ActuatingFotoController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\KomentarVideoController;
use App\Http\Controllers\KomentarFotoController;
use App\Http\Controllers\KuesionerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ============================================================================
// PUBLIC ROUTES (Tanpa Token)
// ============================================================================

// 1. Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/ajukan-akun', [UserController::class, 'ajukanAkun']);

// 2. Public Content Access (Read Only)
Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{id}', [VideoController::class, 'show']);

Route::get('/foto', [ActuatingFotoController::class, 'index']);
Route::get('/foto/{id}', [ActuatingFotoController::class, 'show']);

Route::get('/planning', [PlanningController::class, 'index']);
Route::get('/organizing', [OrganizingController::class, 'index']);
Route::get('/files', [FileController::class, 'index']);

// Komentar (Read)
Route::get('/komentar-video/{id_video}', [KomentarVideoController::class, 'getByVideoId']);
Route::get('/komentar-foto/{id_foto}', [KomentarFotoController::class, 'getByFotoId']);

// Kuesioner (Submit Public)
Route::post('/kuesioner', [KuesionerController::class, 'store']);


// ============================================================================
// PROTECTED ROUTES (Wajib Login / Token Bearer)
// ============================================================================
Route::middleware('auth:sanctum')->group(function () {

    // 1. User Info & Logout
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']); // Pastikan function logout ada di AuthController

    // 2. Admin Routes: User Management
    // PERBAIKAN: Hanya gunakan satu definisi route users-db
    Route::get('/users-db', [UserController::class, 'getUsersDb']); // Pastikan nama function di Controller adalah getUsersDb
    
    Route::get('/pengajuan-akun', [UserController::class, 'getPengajuanAkunList']);
    Route::put('/approve-akun/{id}', [UserController::class, 'approveAkun']);
    Route::delete('/reject-akun/{id}', [UserController::class, 'rejectAkun']);
    Route::delete('/users/{id}', [UserController::class, 'deleteUser']);

    // 3. Admin Routes: Content Management (Create & Delete)
    Route::post('/videos', [VideoController::class, 'store']);
    Route::delete('/videos/{id}', [VideoController::class, 'destroy']);

    Route::post('/foto', [ActuatingFotoController::class, 'store']);
    Route::delete('/foto/{id}', [ActuatingFotoController::class, 'destroy']);

    Route::post('/planning', [PlanningController::class, 'store']);
    Route::delete('/planning/{id}', [PlanningController::class, 'destroy']);

    Route::post('/organizing', [OrganizingController::class, 'store']);
    Route::delete('/organizing/{id}', [OrganizingController::class, 'destroy']);

    Route::post('/files', [FileController::class, 'store']);
    Route::delete('/files/{id}', [FileController::class, 'destroy']);

    // 4. User Interactions (Comment)
    Route::post('/komentar-video', [KomentarVideoController::class, 'store']);
    Route::post('/komentar-foto', [KomentarFotoController::class, 'store']);
    
    Route::delete('/komentar-video/{id}', [KomentarVideoController::class, 'destroy']);
    Route::delete('/komentar-foto/{id}', [KomentarFotoController::class, 'destroy']);

    // 5. Admin: Kuesioner Report
    Route::get('/kuesioner', [KuesionerController::class, 'index']);
});