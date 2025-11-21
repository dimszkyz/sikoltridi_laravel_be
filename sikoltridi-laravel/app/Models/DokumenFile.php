<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumenFile extends Model
{
    protected $table = 'file'; // Nama tabel di SQL adalah 'file'
    public $timestamps = false;
    const CREATED_AT = 'uploaded_at';
    const UPDATED_AT = null;

    protected $fillable = ['title', 'image_file', 'pdf_file', 'uploaded_at'];

    protected $appends = ['pdf_url', 'image_url'];

    public function getPdfUrlAttribute()
    {
        return $this->pdf_file ? url('uploads/files/' . $this->pdf_file) : null;
    }

    public function getImageUrlAttribute()
    {
        return $this->image_file ? url('uploads/images/' . $this->image_file) : null;
    }
}