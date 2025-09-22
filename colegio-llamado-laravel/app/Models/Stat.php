<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Stat extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'fecha',
        'total_estudiantes',
        'total_padres',
        'llamadas_realizadas',
        'llamadas_confirmadas',
        'llamadas_rechazadas',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    // Scopes
    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha', [$fechaInicio, $fechaFin]);
    }

    public function scopeDelMes($query, $mes = null, $año = null)
    {
        $mes = $mes ?? now()->month;
        $año = $año ?? now()->year;
        
        return $query->whereMonth('fecha', $mes)
                    ->whereYear('fecha', $año);
    }

    public function scopeDelAño($query, $año = null)
    {
        $año = $año ?? now()->year;
        return $query->whereYear('fecha', $año);
    }

    // Métodos estáticos
    public static function generarParaFecha(Carbon $fecha): self
    {
        $totalEstudiantes = Estudiante::count();
        $totalPadres = User::padres()->count();
        
        $llamadasRealizadas = RegistroSalida::whereDate('fecha_hora', $fecha)->count();
        $llamadasConfirmadas = RegistroSalida::whereDate('fecha_hora', $fecha)
                                           ->confirmadas()
                                           ->count();
        $llamadasRechazadas = RegistroSalida::whereDate('fecha_hora', $fecha)
                                          ->rechazadas()
                                          ->count();

        return self::updateOrCreate(
            ['fecha' => $fecha->toDateString()],
            [
                'total_estudiantes' => $totalEstudiantes,
                'total_padres' => $totalPadres,
                'llamadas_realizadas' => $llamadasRealizadas,
                'llamadas_confirmadas' => $llamadasConfirmadas,
                'llamadas_rechazadas' => $llamadasRechazadas,
            ]
        );
    }

    public static function generarParaHoy(): self
    {
        return self::generarParaFecha(now());
    }

    public static function obtenerResumenMensual($mes = null, $año = null): array
    {
        $stats = self::delMes($mes, $año)->get();
        
        return [
            'total_estudiantes' => $stats->max('total_estudiantes') ?? 0,
            'total_padres' => $stats->max('total_padres') ?? 0,
            'llamadas_realizadas' => $stats->sum('llamadas_realizadas'),
            'llamadas_confirmadas' => $stats->sum('llamadas_confirmadas'),
            'llamadas_rechazadas' => $stats->sum('llamadas_rechazadas'),
            'dias_con_actividad' => $stats->where('llamadas_realizadas', '>', 0)->count(),
        ];
    }

    // Accessors
    public function getPorcentajeConfirmadasAttribute(): float
    {
        if ($this->llamadas_realizadas === 0) {
            return 0;
        }
        
        return round(($this->llamadas_confirmadas / $this->llamadas_realizadas) * 100, 2);
    }

    public function getPorcentajeRechazadasAttribute(): float
    {
        if ($this->llamadas_realizadas === 0) {
            return 0;
        }
        
        return round(($this->llamadas_rechazadas / $this->llamadas_realizadas) * 100, 2);
    }
}