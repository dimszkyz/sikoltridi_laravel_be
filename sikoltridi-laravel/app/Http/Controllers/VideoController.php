<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function getAllVideos()
    {
        try {
            $videos = Video::all();

            // Mapping hasil agar format JSON sama persis dengan Node.js
            $results = $videos->map(function ($video) {
                return [
                    'id' => $video->id,
                    'media' => url('uploads/video/' . $video->media), // Sesuaikan path
                    'thumbnail' => url('uploads/images/' . $video->thumbnail),
                    'tanggal' => $video->tanggal,
                    'judul' => $video->judul,
                    'keterangan' => $video->keterangan,
                    // field lain jika ada
                ];
            });

            return response()->json($results, 200);
        } catch (\Exception $err) {
            return response()->json([
                'message' => 'Gagal mengambil data video',
                'error' => $err->getMessage(),
            ], 500);
        }
    }

    public function getVideoById($id)
    {
        try {
            $video = Video::find($id);

            if (!$video) {
                return response()->json(['message' => 'Video tidak ditemukan'], 404);
            }

            // Format response single object
            $videoData = $video->toArray();
            $videoData['media'] = url('uploads/video/' . $video->media);
            $videoData['thumbnail'] = url('uploads/images/' . $video->thumbnail);

            return response()->json($videoData, 200);
        } catch (\Exception $err) {
            return response()->json(['message' => 'Gagal mengambil data video'], 500);
        }
    }
}