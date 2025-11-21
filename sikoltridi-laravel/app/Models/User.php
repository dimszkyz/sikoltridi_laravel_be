<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Mapping ke tabel lama
    protected $table = 'user'; 
    protected $primaryKey = 'id_user';
    public $timestamps = false; // SQL lama tidak punya created_at/updated_at di tabel user

    protected $fillable = [
        'username',
        'password',
        'role',
        'nama_lengkap',
    ];

    protected $hidden = [
        'password',
    ];
}