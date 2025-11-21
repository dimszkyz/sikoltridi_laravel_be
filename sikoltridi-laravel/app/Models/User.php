<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'user';        // Sesuai SQL: user
    protected $primaryKey = 'id_user'; // Sesuai SQL: id_user
    public $timestamps = false;       // Tabel user tidak punya created_at/updated_at

    protected $fillable = [
        'username',
        'password',
        'level', // Sesuai SQL (admin, user, superadmin)
    ];

    protected $hidden = [
        'password',
    ];
}