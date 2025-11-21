<?php

namespace App\Http\Controllers;

use App\Models\Planning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class PlanningController extends Controller
{
    public function listPlanning()
    {
        try {
            $rows = Planning::orderBy('uploaded_at', 'desc')->get();
            // Node response: { data: rows }
            return response()->json(['data' => $rows]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengambil data planning.'], 500);
        }
    }

    public function createPlanning(Request $request)
    {
        // Node logic: ambil title & file. image_file NULL.
        $request->validate([
            'title' => 'required',
            'pdf_file' => 'required|file|mimes:pdf' 
        ]);

        try {
            $pdfFile = $request->file('pdf_file');
            // Generate nama file unik agar mirip node js (timestamp)
            $filename = time() . '_' . $pdfFile->getClientOriginalName();
            
            // Simpan ke folder public/uploads/planning
            $pdfFile->move(public_path('uploads/planning'), $filename);

            Planning::create([
                'title' => $request->title,
                'image_file' => null,
                'pdf_file' => $filename,
                // uploaded_at otomatis terisi
            ]);

            return response()->json(['message' => 'Berhasil menambah planning.'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menambah planning.'], 500);
        }
    }

    public function deletePlanning($id)
    {
        try {
            $planning = Planning::find($id);
            if (!$planning) return response()->json(['message' => 'Data tidak ditemukan.'], 404);

            // Hapus File fisik
            $path = public_path('uploads/planning/' . $planning->pdf_file);
            if (File::exists($path)) {
                File::delete($path);
            }

            $planning->delete();

            return response()->json(['message' => 'Berhasil menghapus planning.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus planning.'], 500);
        }
    }
}