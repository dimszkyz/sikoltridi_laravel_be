<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Video
        Schema::create('video', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('keterangan')->nullable();
            $table->string('media');     // Nama file video
            $table->string('thumbnail')->nullable(); // Nama file gambar
            $table->date('tanggal')->nullable();
            // Model Video timestamps = false, jadi tidak perlu timestamps()
        });

        // 2. Tabel Planning
        Schema::create('planning', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image_file')->nullable();
            $table->string('pdf_file');
            $table->timestamp('uploaded_at')->useCurrent(); // Pengganti created_at
        });

        // 3. Tabel Organizing
        Schema::create('organizing', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image_file')->nullable();
            $table->string('pdf_file');
            $table->timestamp('uploaded_at')->useCurrent();
        });

        // 4. Tabel File (DokumenFile / Controlling)
        Schema::create('file', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image_file')->nullable();
            $table->string('pdf_file');
            $table->timestamp('uploaded_at')->useCurrent();
        });

        // 5. Tabel Actuating Foto
        Schema::create('actuating_foto', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image_file');
            $table->text('deskripsi_image')->nullable();
            $table->unsignedBigInteger('upload_by')->nullable(); // Jika ada relasi ke user
            $table->timestamp('uploaded_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actuating_foto');
        Schema::dropIfExists('file');
        Schema::dropIfExists('organizing');
        Schema::dropIfExists('planning');
        Schema::dropIfExists('video');
    }
};