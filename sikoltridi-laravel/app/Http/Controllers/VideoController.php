<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function index()
    {
        // Node: SELECT * FROM video JOIN user ...
        $videos = Video::with('uploader')->orderBy('uploaded_at', 'desc')->get();
        return response()->json($videos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'video' => 'required|mimes:mp4,mov,avi|max:200000', // Max 200MB
            'thumbnail' => 'nullable|image'
        ]);

        // Logic Upload (Pengganti Multer)
        $videoPath = null;
        if ($request->hasFile('video')) {
            // Simpan ke storage/app/public/uploads/video
            $videoPath = $request->file('video')->store('uploads/video', 'public');
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('uploads/video/thumb', 'public');
        }

        $video = Video::create([
            'title' => $request->title,
            'deskripsi' => $request->deskripsi,
            'video_file' => $videoPath, // Simpan path-nya saja
            'thumbnail' => $thumbnailPath,
            'upload_by' => $request->user()->id_user, // Ambil ID dari token Sanctum
            'uploaded_at' => now()
        ]);

        return response()->json(['message' => 'Video berhasil diupload', 'data' => $video], 201);
    }
    
    public function show($id)
    {
        $video = Video::with('uploader')->find($id);
        if (!$video) return response()->json(['message' => 'Video tidak ditemukan'], 404);
        return response()->json($video);
    }
}