<?php

namespace App\Http\Controllers;

use App\Models\Planning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class PlanningController extends Controller
{
    // SEBELUMNYA: listPlanning
    public function index()
    {
        try {
            $rows = Planning::orderBy('uploaded_at', 'desc')->get();
            return response()->json(['data' => $rows]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengambil data planning.', 'error' => $e->getMessage()], 500);
        }
    }

    // SEBELUMNYA: createPlanning
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'pdf_file' => 'required|file|mimes:pdf' 
        ]);

        try {
            $pdfFile = $request->file('pdf_file');
            $filename = time() . '_' . $pdfFile->getClientOriginalName();
            
            $pdfFile->move(public_path('uploads/planning'), $filename);

            Planning::create([
                'title' => $request->title,
                'image_file' => null,
                'pdf_file' => $filename,
            ]);

            return response()->json(['message' => 'Berhasil menambah planning.'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menambah planning.', 'error' => $e->getMessage()], 500);
        }
    }

    // SEBELUMNYA: deletePlanning
    public function destroy($id)
    {
        try {
            $planning = Planning::find($id);
            if (!$planning) return response()->json(['message' => 'Data tidak ditemukan.'], 404);

            $path = public_path('uploads/planning/' . $planning->pdf_file);
            if (File::exists($path)) {
                File::delete($path);
            }

            $planning->delete();

            return response()->json(['message' => 'Berhasil menghapus planning.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus planning.', 'error' => $e->getMessage()], 500);
        }
    }
}