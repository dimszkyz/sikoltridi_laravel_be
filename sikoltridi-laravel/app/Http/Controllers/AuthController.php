<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user) {
             return response()->json(['message' => 'Username tidak ditemukan'], 401);
        }

        // PERBAIKAN PENTING:
        // Cek apakah password di DB sama persis dengan input (Plain Text untuk user lama di SQL)
        // ATAU cek menggunakan Hash (untuk user baru yang register lewat sistem)
        if ($user->password !== $request->password && !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Password salah'], 401);
        }

        // Buat token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login success',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:user,username',
            'password' => 'required|min:6',
            // 'nama_lengkap' => 'required' // Hapus validasi ini jika kolom nama_lengkap tidak ada di tabel User
        ]);

        // Note: Tabel user di SQL dump tidak punya kolom 'nama_lengkap'.
        // Jika ingin menyimpan nama lengkap, pastikan tabelnya sudah di alter/tambah kolom.
        // Di sini saya sesuaikan dengan struktur tabel 'user' yang ada di SQL dump kamu.

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password), // Password di-hash
            'level' => 'user' // PERBAIKAN: Di SQL namanya 'level', bukan 'role'
        ]);

        return response()->json(['message' => 'Registrasi berhasil'], 201);
    }
}