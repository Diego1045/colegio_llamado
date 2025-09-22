<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registros_salida', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('estudiante_id');
            $table->uuid('padre_id');
            $table->timestamp('fecha_hora');
            $table->enum('estado', ['pendiente', 'confirmada', 'rechazada'])->default('pendiente');
            $table->text('motivo')->nullable();
            $table->timestamps();
            
            // Claves foráneas
            $table->foreign('estudiante_id')->references('id')->on('estudiantes')->onDelete('cascade');
            $table->foreign('padre_id')->references('id')->on('users')->onDelete('cascade');
            
            // Índices
            $table->index('fecha_hora');
            $table->index('estado');
            $table->index(['estudiante_id', 'fecha_hora']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registros_salida');
    }
};