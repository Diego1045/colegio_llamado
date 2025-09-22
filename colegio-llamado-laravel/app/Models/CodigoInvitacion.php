<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CodigoInvitacion extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'codigos_invitacion';

    protected $fillable = [
        'codigo',
        'estado',
        'usado_por',
    ];

    // Relaciones
    public function usuarioQueUso(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usado_por');
    }

    // Scopes
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'disponible');
    }

    public function scopeUsados($query)
    {
        return $query->where('estado', 'usado');
    }

    public function scopeInvalidos($query)
    {
        return $query->where('estado', 'invalido');
    }

    // Métodos estáticos
    public static function generar(): self
    {
        do {
            $codigo = strtoupper(Str::random(8));
        } while (self::where('codigo', $codigo)->exists());

        return self::create([
            'codigo' => $codigo,
            'estado' => 'disponible',
        ]);
    }

    public static function validarCodigo(string $codigo): ?self
    {
        return self::where('codigo', $codigo)
                   ->where('estado', 'disponible')
                   ->first();
    }

    // Métodos de utilidad
    public function usar(User $usuario): bool
    {
        if ($this->estado !== 'disponible') {
            return false;
        }

        return $this->update([
            'estado' => 'usado',
            'usado_por' => $usuario->id,
        ]);
    }

    public function invalidar(): bool
    {
        return $this->update(['estado' => 'invalido']);
    }

    public function isDisponible(): bool
    {
        return $this->estado === 'disponible';
    }

    public function isUsado(): bool
    {
        return $this->estado === 'usado';
    }

    public function isInvalido(): bool
    {
        return $this->estado === 'invalido';
    }
}