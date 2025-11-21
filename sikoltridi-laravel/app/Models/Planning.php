<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planning extends Model
{
    protected $table = 'planning';
    
    // SQL menggunakan 'uploaded_at', bukan 'created_at'
    const CREATED_AT = 'uploaded_at';
    const UPDATED_AT = null;

    protected $fillable = ['title', 'image_file', 'pdf_file', 'uploaded_at'];
}