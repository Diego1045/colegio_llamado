<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estudiantes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('grado', 10);
            $table->string('seccion', 10);
            $table->timestamps();
            
            // Índices
            $table->index('grado');
            $table->index(['grado', 'seccion']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estudiantes');
    }
};