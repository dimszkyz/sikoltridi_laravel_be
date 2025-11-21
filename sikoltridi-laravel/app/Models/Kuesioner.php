<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kuesioner extends Model
{
    protected $table = 'kuesioner';
    public $timestamps = false;
    const CREATED_AT = 'submitted_at';
    const UPDATED_AT = null;

    // Masukkan semua kolom a1-d4 sesuai SQL
    protected $guarded = ['id']; // Allow all except ID
}