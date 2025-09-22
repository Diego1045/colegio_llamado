<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroSalida extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'registros_salida';

    protected $fillable = [
        'estudiante_id',
        'padre_id',
        'fecha_hora',
        'estado',
        'motivo',
    ];

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    // Relaciones
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(Estudiante::class);
    }

    public function padre(): BelongsTo
    {
        return $this->belongsTo(User::class, 'padre_id');
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeConfirmadas($query)
    {
        return $query->where('estado', 'confirmada');
    }

    public function scopeRechazadas($query)
    {
        return $query->where('estado', 'rechazada');
    }

    public function scopeHoy($query)
    {
        return $query->whereDate('fecha_hora', today());
    }

    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_hora', [$fechaInicio, $fechaFin]);
    }

    // Métodos de utilidad
    public function confirmar(): bool
    {
        return $this->update(['estado' => 'confirmada']);
    }

    public function rechazar(): bool
    {
        return $this->update(['estado' => 'rechazada']);
    }

    public function isPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    public function isConfirmada(): bool
    {
        return $this->estado === 'confirmada';
    }

    public function isRechazada(): bool
    {
        return $this->estado === 'rechazada';
    }
}