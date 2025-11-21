<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Planning extends Model
{
    protected $table = 'planning';
    public $timestamps = false;

    protected $fillable = ['title', 'file_path', 'image_preview', 'deskripsi', 'upload_by', 'uploaded_at'];
}