<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'configuracion';

    protected $fillable = [
        'clave',
        'valor',
        'descripcion',
    ];

    // Métodos estáticos
    public static function obtener(string $clave, $default = null)
    {
        $config = self::where('clave', $clave)->first();
        return $config ? $config->valor : $default;
    }

    public static function establecer(string $clave, $valor, string $descripcion = null): self
    {
        return self::updateOrCreate(
            ['clave' => $clave],
            [
                'valor' => $valor,
                'descripcion' => $descripcion,
            ]
        );
    }

    public static function eliminar(string $clave): bool
    {
        return self::where('clave', $clave)->delete() > 0;
    }

    // Configuraciones predefinidas
    public static function getHorarioInicio(): string
    {
        return self::obtener('horario_inicio', '07:00');
    }

    public static function getHorarioFin(): string
    {
        return self::obtener('horario_fin', '17:00');
    }

    public static function getNombreColegio(): string
    {
        return self::obtener('nombre_colegio', 'Colegio Llamado');
    }

    public static function getTimezone(): string
    {
        return self::obtener('timezone', 'America/Guatemala');
    }

    public static function getMaxLlamadasPorDia(): int
    {
        return (int) self::obtener('max_llamadas_por_dia', 3);
    }

    public static function isHorarioPermitido(): bool
    {
        $ahora = now()->format('H:i');
        $inicio = self::getHorarioInicio();
        $fin = self::getHorarioFin();
        
        return $ahora >= $inicio && $ahora <= $fin;
    }
}