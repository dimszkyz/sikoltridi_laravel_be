<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File; // Tambahkan import Facade File

class VideoController extends Controller
{
    /**
     * Mengambil semua data video
     */
    public function getAllVideos()
    {
        try {
            // Ambil semua data video (raw data), urutkan dari yang terbaru (ID terbesar)
            // Kita tidak mengubah 'media' atau 'thumbnail' menjadi url() di sini
            // karena Frontend (React) akan menggabungkannya dengan API_BASE sendiri.
            $videos = Video::orderBy('id', 'desc')->get();

            // Bungkus dengan key 'data' agar konsisten dengan controller lain
            // dan agar sesuai dengan ekspektasi Frontend (res.data.data)
            // Format response: { "data": [ ... ] }
            return response()->json(['data' => $videos], 200);

        } catch (\Exception $err) {
            return response()->json([
                'message' => 'Gagal mengambil data video',
                'error' => $err->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengambil satu video berdasarkan ID
     */
    public function getVideoById($id)
    {
        try {
            $video = Video::find($id);

            if (!$video) {
                return response()->json(['message' => 'Video tidak ditemukan'], 404);
            }

            // Kembalikan data raw dalam wrapper 'data'
            // Field 'media' dan 'thumbnail' tetap berisi nama file saja.
            return response()->json(['data' => $video], 200);

        } catch (\Exception $err) {
            return response()->json([
                'message' => 'Gagal mengambil detail video',
                'error' => $err->getMessage()
            ], 500);
        }
    }

    /**
     * (Opsional) Menambah Video (Create)
     * Endpoint: POST /api/videos
     */
    public function store(Request $request)
    {
        // Validasi input
        // thumbnail_file opsional, tapi video_file wajib
        $request->validate([
            'judul' => 'required|string',
            'video_file' => 'required|file|mimetypes:video/mp4,video/avi,video/mpeg|max:51200', // Max 50MB (51200 KB)
            'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB (5120 KB)
        ]);

        try {
            // 1. Upload Video
            $videoName = null;
            if ($request->hasFile('video_file')) {
                $file = $request->file('video_file');
                // Buat nama file unik: timestamp_vid_namaasli
                $videoName = time() . '_vid_' . $file->getClientOriginalName();
                // Simpan ke folder public/uploads/video
                $file->move(public_path('uploads/video'), $videoName);
            }

            // 2. Upload Thumbnail (Jika ada)
            $thumbName = null;
            if ($request->hasFile('thumbnail_file')) {
                $file = $request->file('thumbnail_file');
                // Buat nama file unik: timestamp_thumb_namaasli
                $thumbName = time() . '_thumb_' . $file->getClientOriginalName();
                // Simpan ke folder public/uploads/video/thumb
                // Pastikan folder ini ada, atau Laravel akan coba membuatnya (jika permission izinkan)
                $file->move(public_path('uploads/video/thumb'), $thumbName);
            }

            // 3. Simpan ke Database
            $video = new Video();
            $video->judul = $request->judul;
            $video->keterangan = $request->keterangan; // Bisa null
            $video->tanggal = date('Y-m-d'); // Set tanggal upload hari ini
            $video->media = $videoName;
            $video->thumbnail = $thumbName;
            $video->save();

            return response()->json(['message' => 'Video berhasil ditambahkan', 'data' => $video], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal upload video', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * (Opsional) Hapus Video
     * Endpoint: DELETE /api/videos/{id}
     */
    public function destroy($id)
    {
        try {
            $video = Video::find($id);
            if (!$video) return response()->json(['message' => 'Video tidak ditemukan'], 404);

            // Hapus file fisik video jika ada
            if ($video->media) {
                $videoPath = public_path('uploads/video/' . $video->media);
                if (File::exists($videoPath)) {
                    File::delete($videoPath);
                }
            }

            // Hapus file fisik thumbnail jika ada
            if ($video->thumbnail) {
                $thumbPath = public_path('uploads/video/thumb/' . $video->thumbnail);
                if (File::exists($thumbPath)) {
                    File::delete($thumbPath);
                }
            }

            // Hapus record dari database
            $video->delete();
            
            return response()->json(['message' => 'Video berhasil dihapus']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus video', 'error' => $e->getMessage()], 500);
        }
    }
}