<?php

namespace App\Http\Controllers;

use App\Models\DokumenFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class FileController extends Controller
{
    public function index()
    {
        $data = DokumenFile::orderBy('uploaded_at', 'desc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'pdf_file' => 'nullable|mimes:pdf|max:20480',
            'image_file' => 'nullable|image|max:5120',
        ]);

        try {
            $pdfName = null;
            if ($request->hasFile('pdf_file')) {
                $pdfName = time() . '_' . $request->file('pdf_file')->getClientOriginalName();
                $request->file('pdf_file')->move(public_path('uploads/files'), $pdfName);
            }

            $imgName = null;
            if ($request->hasFile('image_file')) {
                $imgName = time() . '_' . $request->file('image_file')->getClientOriginalName();
                $request->file('image_file')->move(public_path('uploads/images'), $imgName);
            }

            DokumenFile::create([
                'title' => $request->title,
                'pdf_file' => $pdfName,
                'image_file' => $imgName,
                'uploaded_at' => now()
            ]);

            return response()->json(['message' => 'File berhasil diupload'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal upload file', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $file = DokumenFile::find($id);
        if ($file) {
            if ($file->pdf_file) {
                $pathPdf = public_path('uploads/files/' . $file->pdf_file);
                if (File::exists($pathPdf)) File::delete($pathPdf);
            }
            if ($file->image_file) {
                $pathImg = public_path('uploads/images/' . $file->image_file);
                if (File::exists($pathImg)) File::delete($pathImg);
            }
            $file->delete();
            return response()->json(['message' => 'File berhasil dihapus']);
        }
        return response()->json(['message' => 'File tidak ditemukan'], 404);
    }
}