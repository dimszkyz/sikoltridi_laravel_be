<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $table = 'video'; // Sesuai SQL
    // Primary key 'id' sudah default, jadi tidak perlu dideklarasikan
    public $timestamps = false; // Asumsi SQL lama pakai datetime manual atau tidak ada

    protected $fillable = [
        'title', // Sesuaikan dengan kolom di SQL (misal: judul atau title)
        'video_file', 
        'thumbnail',
        'deskripsi',
        'upload_by',
        'uploaded_at'
    ];

    // Relasi ke User
    public function uploader() {
        return $this->belongsTo(User::class, 'upload_by', 'id_user');
    }
}