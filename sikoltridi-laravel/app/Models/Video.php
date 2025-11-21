<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Video extends Model
{
    protected $table = 'video'; 
    public $timestamps = false; 

    // PERBAIKAN: Sesuaikan dengan kolom asli di database (berdasarkan sql dump)
    protected $fillable = [
        'judul',           // Sebelumnya: title
        'file_path',       // Sebelumnya: video_file
        'thumbnail_path',  // Sebelumnya: thumbnail
        'deskripsi',
        'upload_by',
        'uploaded_at'
    ];

    // Optional: Accessor agar frontend React tetap bisa akses property 'video_url' jika perlu
    protected $appends = ['video_url', 'thumbnail_url'];

    public function getVideoUrlAttribute() {
        return url('storage/' . $this->file_path);
    }

    public function getThumbnailUrlAttribute() {
        return $this->thumbnail_path ? url('storage/' . $this->thumbnail_path) : null;
    }

    public function uploader() {
        return $this->belongsTo(User::class, 'upload_by', 'id_user');
    }
}