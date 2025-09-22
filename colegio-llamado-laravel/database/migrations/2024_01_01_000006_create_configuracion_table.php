<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracion', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('clave', 50)->unique();
            $table->text('valor');
            $table->text('descripcion')->nullable();
            $table->timestamps();
            
            // Índice
            $table->index('clave');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracion');
    }
};