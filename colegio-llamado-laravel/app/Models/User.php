<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relaciones
    public function estudiantes(): BelongsToMany
    {
        return $this->belongsToMany(Estudiante::class, 'padres_estudiantes', 'padre_id', 'estudiante_id')
                    ->withTimestamps();
    }

    public function registrosSalida(): HasMany
    {
        return $this->hasMany(RegistroSalida::class, 'padre_id');
    }

    public function codigosUsados(): HasMany
    {
        return $this->hasMany(CodigoInvitacion::class, 'usado_por');
    }

    // Scopes
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    public function scopePadres($query)
    {
        return $query->where('role', 'padre');
    }

    // Accessors
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }

    // Métodos de utilidad
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPadre(): bool
    {
        return $this->role === 'padre';
    }
}