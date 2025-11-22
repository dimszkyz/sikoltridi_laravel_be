<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class VideoController extends Controller
{
    /**
     * Mengambil semua data video
     * SEBELUMNYA: getAllVideos
     */
    public function index()
    {
        try {
            $videos = Video::orderBy('id', 'desc')->get();
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
     * SEBELUMNYA: getVideoById
     */
    public function show($id)
    {
        try {
            $video = Video::find($id);

            if (!$video) {
                return response()->json(['message' => 'Video tidak ditemukan'], 404);
            }

            return response()->json(['data' => $video], 200);

        } catch (\Exception $err) {
            return response()->json([
                'message' => 'Gagal mengambil detail video',
                'error' => $err->getMessage()
            ], 500);
        }
    }

    /**
     * Menambah Video (Create)
     * Sudah benar (store)
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string',
            'video_file' => 'required|file|mimetypes:video/mp4,video/avi,video/mpeg|max:51200',
            'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        try {
            $videoName = null;
            if ($request->hasFile('video_file')) {
                $file = $request->file('video_file');
                $videoName = time() . '_vid_' . $file->getClientOriginalName();
                $file->move(public_path('uploads/video'), $videoName);
            }

            $thumbName = null;
            if ($request->hasFile('thumbnail_file')) {
                $file = $request->file('thumbnail_file');
                $thumbName = time() . '_thumb_' . $file->getClientOriginalName();
                $file->move(public_path('uploads/video/thumb'), $thumbName);
            }

            $video = new Video();
            $video->judul = $request->judul;
            $video->keterangan = $request->keterangan;
            $video->tanggal = date('Y-m-d');
            $video->media = $videoName;
            $video->thumbnail = $thumbName;
            $video->save();

            return response()->json(['message' => 'Video berhasil ditambahkan', 'data' => $video], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal upload video', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Hapus Video
     * Sudah benar (destroy)
     */
    public function destroy($id)
{
    try {
        $video = Video::find($id);
        if (!$video) return response()->json(['message' => 'Video tidak ditemukan'], 404);

        // --- PERBAIKAN: Hapus Komentar Terkait Terlebih Dahulu ---
        DB::table('komentar_video')->where('id_video', $id)->delete();
        // ---------------------------------------------------------

        // Hapus File Video Fisik
        if ($video->media) {
            $videoPath = public_path('uploads/video/' . $video->media);
            if (File::exists($videoPath)) {
                File::delete($videoPath);
            }
        }

        // Hapus File Thumbnail Fisik
        if ($video->thumbnail) {
            $thumbPath = public_path('uploads/video/thumb/' . $video->thumbnail);
            if (File::exists($thumbPath)) {
                File::delete($thumbPath);
            }
        }

        // Baru Hapus Record Video
        $video->delete();
        
        return response()->json(['message' => 'Video berhasil dihapus']);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Gagal menghapus video', 'error' => $e->getMessage()], 500);
    }
}
}