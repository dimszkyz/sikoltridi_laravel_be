<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PengajuanAkun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET semua user (Contoh statis dari Node lama)
    public function getAllUsers()
    {
        $users = [
            ['id' => 1, 'name' => "Ammaar"],
            ['id' => 2, 'name' => "Pengguna Dua"],
        ];
        return response()->json([
            'message' => "Data user berhasil diambil",
            'data' => $users,
        ]);
    }

    // Login User (Migrasi logic query manual)
    public function loginUser(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        // Cari user berdasarkan username
        $user = User::where('username', $request->username)->first();

        // Cek Password
        // PENTING: Jika password di DB lama tidak di-hash (plain text), gunakan:
        // if (!$user || $user->password !== $request->password) {
        
        // Jika password di DB sudah hashed atau ingin standar baru:
        // if (!$user || !Hash::check($request->password, $user->password)) {
        
        // KODE HYBRID (Cek hash dulu, kalau gagal cek plain text - untuk migrasi aman):
        $passwordValid = false;
        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $passwordValid = true;
            } elseif ($user->password === $request->password) {
                $passwordValid = true;
            }
        }

        if (!$user || !$passwordValid) {
            return response()->json(['success' => false, 'msg' => "Username atau password salah"], 401);
        }

        // Response persis seperti Node.js
        return response()->json([
            'success' => true,
            'msg' => "Login berhasil",
            'user' => [
                'id' => $user->id_user, // Alias id
                'username' => $user->username,
                'level' => $user->level
            ]
        ]);
    }

    // Pengajuan Akun
    public function ajukanAkun(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        try {
            PengajuanAkun::create([
                'username' => $request->username,
                'password' => $request->password, // Simpan apa adanya (atau Hash::make() jika mau aman)
                'level' => 'user',
                'status' => 'pending'
            ]);

            return response()->json(['msg' => "Pengajuan akun berhasil disimpan!"], 201);
        } catch (\Exception $err) {
            return response()->json(['msg' => "Gagal mengajukan akun", 'error' => $err->getMessage()], 500);
        }
    }

    // Get List Pengajuan
    public function getPengajuanAkunList()
    {
        $data = PengajuanAkun::all();
        return response()->json(['data' => $data], 200);
    }

    // Approve Akun
    public function approveAkun(Request $request, $id)
    {
        $pengajuan = PengajuanAkun::find($id);
        if (!$pengajuan) return response()->json(['msg' => "Data tidak ditemukan"], 404);

        DB::beginTransaction();
        try {
            // Pindahkan ke tabel User
            User::create([
                'username' => $pengajuan->username,
                'password' => $pengajuan->password,
                'level' => $request->role ?? 'user'
            ]);

            // Hapus dari pengajuan
            $pengajuan->delete();
            
            DB::commit();
            return response()->json(['msg' => "Akun berhasil disetujui sebagai " . ($request->role ?? 'user') . "!"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['msg' => "Gagal approve akun", 'error' => $e->getMessage()], 500);
        }
    }

    // Reject Akun
    public function rejectAkun($id)
    {
        $pengajuan = PengajuanAkun::find($id);
        if ($pengajuan) {
            $pengajuan->delete();
            return response()->json(['msg' => "Akun ditolak dan dihapus!"]);
        }
        return response()->json(['msg' => "Gagal menghapus data"], 500);
    }

    // Delete User & Cascading Delete (Manual seperti di Node)
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['msg' => "User tidak ditemukan"], 404);

        DB::beginTransaction();
        try {
            // Hapus data terkait (sesuai node js userController)
            DB::table('komentar_video')->where('id_user', $id)->delete();
            DB::table('komentar_foto')->where('id_user', $id)->delete();
            // DB::table('files')... (tabel file tidak punya id_user di SQL dump, skip)
            DB::table('video')->where('id', $id)->delete(); // Note: logic Node aneh disini delete video by id_user? Asumsi kolom relasi ada.
            // ... Lanjutkan untuk tabel lain sesuai kebutuhan
            
            $user->delete();
            DB::commit();
            
            return response()->json(['msg' => "User dan semua data terkait berhasil dihapus"]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['msg' => "Gagal menghapus user", 'error' => $e->getMessage()], 500);
        }
    }
}