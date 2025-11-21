<?php

namespace App\Http\Controllers;

use App\Models\Organizing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class OrganizingController extends Controller
{
    public function index()
    {
        $data = Organizing::orderBy('uploaded_at', 'desc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'pdf_file' => 'required|mimes:pdf|max:20480' // Max 20MB
        ]);

        try {
            $filename = time() . '_' . $request->file('pdf_file')->getClientOriginalName();
            $request->file('pdf_file')->move(public_path('uploads/organizing'), $filename);

            Organizing::create([
                'title' => $request->title,
                'pdf_file' => $filename,
                'uploaded_at' => now()
            ]);

            return response()->json(['message' => 'Berhasil menambah data organizing.'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menambah data.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $item = Organizing::find($id);
        if ($item) {
            $path = public_path('uploads/organizing/' . $item->pdf_file);
            if (File::exists($path)) File::delete($path);
            $item->delete();
            return response()->json(['message' => 'Berhasil menghapus data.']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}