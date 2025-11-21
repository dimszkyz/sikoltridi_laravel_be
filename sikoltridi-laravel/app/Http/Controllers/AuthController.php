<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('username', $request->username)->first();

        // Cek password (Asumsi di Node.js pakai bcrypt, jika plain text, sesuaikan)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Username atau Password salah'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login success',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function register(Request $request)
    {
        // Sesuaikan validasi dengan logic Node.js lama
        $request->validate([
            'username' => 'required|unique:user,username',
            'password' => 'required|min:6',
            'nama_lengkap' => 'required'
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'role' => 'user' // Default value
        ]);

        return response()->json(['message' => 'Registrasi berhasil'], 201);
    }
}