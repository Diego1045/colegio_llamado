<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('codigos_invitacion', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('codigo', 20)->unique();
            $table->enum('estado', ['disponible', 'usado', 'invalido'])->default('disponible');
            $table->uuid('usado_por')->nullable();
            $table->timestamps();
            
            // Clave foránea
            $table->foreign('usado_por')->references('id')->on('users')->nullOnDelete();
            
            // Índices
            $table->index('estado');
            $table->index('codigo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('codigos_invitacion');
    }
};