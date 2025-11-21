<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organizing extends Model
{
    protected $table = 'organizing';
    public $timestamps = false;
    
    // Menggunakan uploaded_at sebagai created_at
    const CREATED_AT = 'uploaded_at';
    const UPDATED_AT = null;

    protected $fillable = ['title', 'image_file', 'pdf_file', 'uploaded_at'];

    protected $appends = ['pdf_url'];

    public function getPdfUrlAttribute()
    {
        return $this->pdf_file ? url('uploads/organizing/' . $this->pdf_file) : null;
    }
}