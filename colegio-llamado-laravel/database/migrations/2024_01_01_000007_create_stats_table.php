<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('fecha')->unique();
            $table->integer('total_estudiantes')->default(0);
            $table->integer('total_padres')->default(0);
            $table->integer('llamadas_realizadas')->default(0);
            $table->integer('llamadas_confirmadas')->default(0);
            $table->integer('llamadas_rechazadas')->default(0);
            $table->timestamps();
            
            // Índice
            $table->index('fecha');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stats');
    }
};