<?php

namespace App\Http\Controllers;

use App\Models\KomentarVideo;
use Illuminate\Http\Request;

class KomentarVideoController extends Controller
{
    public function getByVideoId($id_video)
    {
        $komentar = KomentarVideo::with('user')
            ->where('id_video', $id_video)
            ->orderBy('tanggal', 'desc')
            ->get();
            
        // Format response sesuai Node: [{ id, isi_komentar, tanggal, username, ... }]
        $result = $komentar->map(function($k) {
            return [
                'id' => $k->id,
                'id_video' => $k->id_video,
                'id_user' => $k->id_user,
                'isi_komentar' => $k->isi_komentar,
                'tanggal' => $k->tanggal,
                'username' => $k->user ? $k->user->username : 'Unknown'
            ];
        });

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_video' => 'required|exists:video,id',
            'isi_komentar' => 'required'
        ]);

        KomentarVideo::create([
            'id_video' => $request->id_video,
            'id_user' => $request->user()->id_user,
            'isi_komentar' => $request->isi_komentar,
            'tanggal' => now()
        ]);

        return response()->json(['message' => 'Komentar berhasil ditambahkan'], 201);
    }

    public function destroy($id)
    {
        $k = KomentarVideo::find($id);
        if($k) {
            $k->delete();
            return response()->json(['message' => 'Komentar dihapus']);
        }
        return response()->json(['message' => 'Not found'], 404);
    }
}