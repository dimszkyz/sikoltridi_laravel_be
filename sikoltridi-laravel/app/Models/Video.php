<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $table = 'video';
    public $timestamps = false; 

    protected $fillable = [
        'media',
        'thumbnail',
        'tanggal',
        'judul',
        'keterangan'
    ];

    // Tambahkan field custom ke JSON response
    protected $appends = ['media_url', 'thumbnail_url'];

    // Logika konversi URL persis seperti videoController.js Node
    public function getMediaUrlAttribute()
    {
        // Asumsi file disimpan di folder public/uploads/video
        return url('uploads/video/' . $this->media);
    }

    public function getThumbnailUrlAttribute()
    {
        // Asumsi file disimpan di folder public/uploads/images
        return url('uploads/images/' . $this->thumbnail);
    }
}