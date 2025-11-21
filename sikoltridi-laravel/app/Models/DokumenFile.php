<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenFile extends Model
{
    use HasFactory;

    // PERBAIKAN PENTING: Sambungkan ke tabel 'file' yang ada di SQL
    protected $table = 'file'; 
    
    // Matikan timestamps jika tabel 'file' tidak punya created_at/updated_at
    // (Lihat SQL kamu: tabel file punya uploaded_at, tapi bukan created_at default laravel)
    public $timestamps = false; 

    protected $fillable = [
        'title',
        'image_file',
        'pdf_file',
        'uploaded_at'
    ];
}