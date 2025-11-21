<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KomentarVideo extends Model
{
    protected $table = 'komentar_video';
    public $timestamps = false;
    
    // Default kolom timestamp di SQL adalah 'tanggal'
    // Kita matikan auto timestamp Laravel dan handle manual di controller
    
    protected $fillable = ['id_video', 'id_user', 'isi_komentar', 'tanggal'];

    public function user() {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }
}