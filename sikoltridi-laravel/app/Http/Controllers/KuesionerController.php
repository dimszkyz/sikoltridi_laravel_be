<?php

namespace App\Http\Controllers;

use App\Models\Kuesioner;
use Illuminate\Http\Request;

class KuesionerController extends Controller
{
    public function index()
    {
        $data = Kuesioner::orderBy('submitted_at', 'desc')->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        // Validasi dasar, data kuesioner banyak kolomnya
        $data = $request->all();
        $data['submitted_at'] = now();

        try {
            Kuesioner::create($data);
            return response()->json(['message' => 'Kuesioner berhasil disimpan'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menyimpan kuesioner', 'error' => $e->getMessage()], 500);
        }
    }
}