<?php

namespace App\Http\Controllers;

use App\Models\KomentarFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class KomentarFotoController extends Controller
{
    // Mengambil semua komentar untuk foto tertentu
    public function getByFotoId($id_foto)
    {
        try {
            // Menggunakan Eloquent dengan eager loading 'user' untuk performa
            $komentar = KomentarFoto::with('user')
                ->where('id_foto', $id_foto)
                ->orderBy('tanggal', 'desc') // Urutkan dari yang terbaru
                ->get();

            // Format data agar sesuai dengan ekspektasi frontend React
            // Frontend biasanya mengharapkan array object dengan properti username langsung
            $formattedData = $komentar->map(function ($item) {
                return [
                    'id' => $item->id,
                    'id_foto' => $item->id_foto,
                    'id_user' => $item->id_user,
                    'isi_komentar' => $item->isi_komentar,
                    'tanggal' => $item->tanggal,
                    'username' => $item->user ? $item->user->username : 'Unknown User' // Handle jika user terhapus
                ];
            });

            return response()->json([
                'data' => $formattedData
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil komentar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Menyimpan komentar baru
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'id_foto' => 'required|exists:actuating_foto,id', // Pastikan ID foto ada di tabel actuating_foto
            'isi_komentar' => 'required|string'
        ]);

        try {
            // Simpan ke database
            $komentar = KomentarFoto::create([
                'id_foto' => $request->id_foto,
                'id_user' => $request->user()->id_user, // Ambil ID user dari token auth (Sanctum)
                'isi_komentar' => $request->isi_komentar,
                'tanggal' => now() // Gunakan waktu server saat ini
            ]);

            return response()->json([
                'message' => 'Komentar berhasil ditambahkan',
                'data' => $komentar
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan komentar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Menghapus komentar (Opsional, biasanya untuk admin)
    public function destroy($id)
    {
        try {
            $komentar = KomentarFoto::find($id);

            if (!$komentar) {
                return response()->json(['message' => 'Komentar tidak ditemukan'], 404);
            }

            $komentar->delete();

            return response()->json(['message' => 'Komentar berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus komentar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
