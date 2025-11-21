<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KomentarFoto extends Model
{
    // Nama tabel sesuai SQL dump
    protected $table = 'komentar_foto'; 

    // Tidak menggunakan timestamps default Laravel (created_at, updated_at)
    public $timestamps = false; 

    // Kolom yang bisa diisi (mass assignable)
    protected $fillable = [
        'id_foto', 
        'id_user', 
        'isi_komentar', 
        'tanggal'
    ];

    // Relasi ke User (yang berkomentar)
    // Foreign key di tabel komentar_foto: id_user
    // Primary key di tabel user: id_user
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    // Relasi ke Foto (yang dikomentari)
    // Foreign key di tabel komentar_foto: id_foto
    // Primary key di tabel actuating_foto: id
    public function foto()
    {
        return $this->belongsTo(ActuatingFoto::class, 'id_foto', 'id');
    }
}