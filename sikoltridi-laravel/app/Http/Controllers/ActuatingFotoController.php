<?php

namespace App\Http\Controllers;

use App\Models\ActuatingFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ActuatingFotoController extends Controller
{
    public function index()
    {
        $data = ActuatingFoto::with('uploader')->orderBy('uploaded_at', 'desc')->get();
        return response()->json($data); // Node mengirim array langsung
    }

    public function show($id)
    {
        $data = ActuatingFoto::with('uploader')->find($id);
        if(!$data) return response()->json(['message' => 'Foto tidak ditemukan'], 404);
        
        // Menyesuaikan format response
        $res = $data->toArray();
        $res['image_file'] = url('uploads/foto/' . $data->image_file); // Override nama file dengan URL
        
        return response()->json($res);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'image_file' => 'required|image|max:5120', // Max 5MB
            'deskripsi_image' => 'nullable'
        ]);

        try {
            $filename = 'foto-' . time() . '-' . rand(1000, 9999) . '.' . $request->file('image_file')->getClientOriginalExtension();
            $request->file('image_file')->move(public_path('uploads/foto'), $filename);

            $foto = ActuatingFoto::create([
                'title' => $request->title,
                'image_file' => $filename,
                'deskripsi_image' => $request->deskripsi_image,
                'upload_by' => $request->user()->id_user,
                'uploaded_at' => now()
            ]);

            return response()->json(['message' => 'Foto berhasil diupload', 'data' => $foto], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal upload foto', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $foto = ActuatingFoto::find($id);
        if ($foto) {
            $path = public_path('uploads/foto/' . $foto->image_file);
            if (File::exists($path)) File::delete($path);
            $foto->delete();
            return response()->json(['message' => 'Foto berhasil dihapus']);
        }
        return response()->json(['message' => 'Foto tidak ditemukan'], 404);
    }
}