<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estudiante extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nombre',
        'apellido',
        'grado',
        'seccion',
    ];

    // Relaciones
    public function padres(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'padres_estudiantes', 'estudiante_id', 'padre_id')
                    ->withTimestamps();
    }

    public function registrosSalida(): HasMany
    {
        return $this->hasMany(RegistroSalida::class);
    }

    // Scopes
    public function scopeByGrado($query, $grado)
    {
        return $query->where('grado', $grado);
    }

    public function scopeBySeccion($query, $seccion)
    {
        return $query->where('seccion', $seccion);
    }

    public function scopeByGradoSeccion($query, $grado, $seccion)
    {
        return $query->where('grado', $grado)->where('seccion', $seccion);
    }

    // Accessors
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }

    public function getGradoSeccionAttribute(): string
    {
        return "{$this->grado} - {$this->seccion}";
    }

    // Métodos de utilidad
    public function tienePadre(User $padre): bool
    {
        return $this->padres()->where('users.id', $padre->id)->exists();
    }
}