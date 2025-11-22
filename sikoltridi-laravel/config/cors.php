<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // HAPUS tanda '*' dan masukkan domain spesifik Anda di sini
    // Penulisan domain TIDAK BOLEH ada garis miring (/) di belakangnya
    'allowed_origins' => [
        'http://sikoltridi.sidome.id',
        'https://sikoltridi.sidome.id',
        'http://localhost:5173',      // Untuk development di laptop (Vite)
        'http://127.0.0.1:5173',      // Alternatif IP lokal
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Ubah ke true agar login/cookies/session bisa berjalan
    'supports_credentials' => true,

];