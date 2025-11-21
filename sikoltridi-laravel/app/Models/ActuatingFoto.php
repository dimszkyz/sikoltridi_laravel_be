<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActuatingFoto extends Model
{
    protected $table = 'actuating_foto';
    public $timestamps = false;
    const CREATED_AT = 'uploaded_at';
    const UPDATED_AT = null;

    protected $fillable = ['title', 'image_file', 'deskripsi_image', 'upload_by', 'uploaded_at'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return url('uploads/foto/' . $this->image_file);
    }

    public function uploader() {
        return $this->belongsTo(User::class, 'upload_by', 'id_user');
    }
}