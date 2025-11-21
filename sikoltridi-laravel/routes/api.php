<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\OrganizingController;
use App\Http\Controllers\ActuatingFotoController;
use App\Http\Controllers\FileController; // Untuk Controlling/File umum
use App\Http\Controllers\KomentarVideoController;
use App\Http\Controllers\KomentarFotoController;
use App\Http\Controllers\KuesionerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ============================================================================
// PUBLIC ROUTES (Bisa diakses tanpa login token)
// ============================================================================

// 1. Authentication
Route::post('/login', [AuthController::class, 'login']); // Login User & Admin
Route::post('/ajukan-akun', [UserController::class, 'ajukanAkun']); // Register/Pengajuan

// 2. Public Content Access (Read Only)
// Video
Route::get('/videos', [VideoController::class, 'index']);
Route::get('/videos/{id}', [VideoController::class, 'show']);

// Foto (Actuating)
Route::get('/foto', [ActuatingFotoController::class, 'index']);
Route::get('/foto/{id}', [ActuatingFotoController::class, 'show']);

// Planning, Organizing, Controlling (File Lists)
Route::get('/planning', [PlanningController::class, 'index']);
Route::get('/organizing', [OrganizingController::class, 'index']);
Route::get('/files', [FileController::class, 'index']); // Controlling/File

// Komentar (Read)
Route::get('/komentar-video/{id_video}', [KomentarVideoController::class, 'getByVideoId']);
Route::get('/komentar-foto/{id_foto}', [KomentarFotoController::class, 'getByFotoId']);

// Kuesioner (Submit Public)
Route::post('/kuesioner', [KuesionerController::class, 'store']);


// ============================================================================
// PROTECTED ROUTES (Harus Login / Punya Token Bearer)
// ============================================================================
Route::middleware('auth:sanctum')->group(function () {

    // 1. User Info
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // 2. Admin Routes: User Management
    // Digunakan di halaman: admin/DaftarPengajuanAkun.jsx & admin/admin.jsx
    Route::get('/users-db', [UserController::class, 'getAllUsersDB']); // List User Aktif
    Route::get('/pengajuan-akun', [UserController::class, 'getPengajuanAkunList']); // List Pending
    Route::put('/approve-akun/{id}', [UserController::class, 'approveAkun']); // Terima Akun
    Route::delete('/reject-akun/{id}', [UserController::class, 'rejectAkun']); // Tolak Akun
    Route::delete('/users/{id}', [UserController::class, 'deleteUser']); // Hapus User Aktif

    // 3. Admin Routes: Content Management (Create & Delete)
    
    // Video (Halaman: admin/AddVideo.jsx, admin/video.jsx)
    Route::post('/videos', [VideoController::class, 'store']);
    Route::delete('/videos/{id}', [VideoController::class, 'destroy']);

    // Foto/Actuating (Halaman: admin/AddFoto.jsx, admin/Foto.jsx)
    Route::post('/foto', [ActuatingFotoController::class, 'store']);
    Route::delete('/foto/{id}', [ActuatingFotoController::class, 'destroy']);

    // Planning (Halaman: admin/AddPlanning.jsx, admin/Planning.jsx)
    Route::post('/planning', [PlanningController::class, 'store']);
    Route::delete('/planning/{id}', [PlanningController::class, 'destroy']);

    // Organizing (Halaman: admin/AddOrganizing.jsx, admin/Organizing.jsx)
    Route::post('/organizing', [OrganizingController::class, 'store']);
    Route::delete('/organizing/{id}', [OrganizingController::class, 'destroy']);

    // Controlling/File (Halaman: admin/AddFile.jsx, admin/DaftarFile.jsx)
    Route::post('/files', [FileController::class, 'store']);
    Route::delete('/files/{id}', [FileController::class, 'destroy']);

    // 4. User Interactions (Comment)
    Route::post('/komentar-video', [KomentarVideoController::class, 'store']);
    Route::post('/komentar-foto', [KomentarFotoController::class, 'store']);
    
    // Delete Komentar (Optional: Biasanya admin bisa hapus)
    Route::delete('/komentar-video/{id}', [KomentarVideoController::class, 'destroy']);
    Route::delete('/komentar-foto/{id}', [KomentarFotoController::class, 'destroy']);

    // 5. Admin: Kuesioner Report
    Route::get('/kuesioner', [KuesionerController::class, 'index']);
});