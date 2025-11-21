<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        // Node lama mungkin mengembalikan JSON mentah. 
        // Kita pastikan urutannya sama.
        $videos = Video::with('uploader')->orderBy('uploaded_at', 'desc')->get();
        return response()->json($videos);
    }

    public function store(Request $request)
    {
        // React mengirim field bernama 'title', 'deskripsi', 'video', 'thumbnail'
        $request->validate([
            'title' => 'required', 
            'video' => 'required|mimes:mp4,mov,avi|max:200000', 
            'thumbnail' => 'nullable|image'
        ]);

        $videoPath = null;
        if ($request->hasFile('video')) {
            // Simpan file dan ambil path-nya
            $videoPath = $request->file('video')->store('uploads/video', 'public');
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('uploads/video/thumb', 'public');
        }

        // PERBAIKAN: Mapping input React -> Kolom Database
        $video = Video::create([
            'judul' => $request->title, // Input 'title' masuk ke kolom 'judul'
            'deskripsi' => $request->deskripsi,
            'file_path' => $videoPath, // Input file masuk ke 'file_path'
            'thumbnail_path' => $thumbnailPath, // Input thumb masuk ke 'thumbnail_path'
            'upload_by' => $request->user()->id_user, 
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