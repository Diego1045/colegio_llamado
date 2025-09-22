<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('padres_estudiantes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('padre_id');
            $table->uuid('estudiante_id');
            $table->timestamps();
            
            // Claves foráneas
            $table->foreign('padre_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('estudiante_id')->references('id')->on('estudiantes')->onDelete('cascade');
            
            // Índice único para evitar duplicados
            $table->unique(['padre_id', 'estudiante_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('padres_estudiantes');
    }
};