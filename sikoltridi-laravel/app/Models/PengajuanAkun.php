<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanAkun extends Model
{
    protected $table = 'pengajuan_akun';
    public $timestamps = false; // Kita handle created_at manual atau via boot

    // SQL punya kolom 'created_at', tapi tidak ada 'updated_at'. 
    // Kita set konstanta agar Laravel hanya mengisi created_at.
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'username',
        'password',
        'level',
        'status'
    ];
}