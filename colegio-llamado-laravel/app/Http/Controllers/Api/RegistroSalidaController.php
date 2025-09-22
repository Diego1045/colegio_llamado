<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistroSalida;
use App\Models\Estudiante;
use App\Models\Configuracion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class RegistroSalidaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = RegistroSalida::with(['estudiante', 'padre']);
        
        if (!$user->isAdmin()) {
            // Los padres solo ven sus propios registros
            $query->where('padre_id', $user->id);
        }

        // Filtros opcionales
        if ($request->has('fecha')) {
            $query->whereDate('fecha_hora', $request->fecha);
        }

        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('estudiante_id')) {
            $query->where('estudiante_id', $request->estudiante_id);
        }

        $registros = $query->orderBy('fecha_hora', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $registros->map(function ($registro) {
                return [
                    'id' => $registro->id,
                    'fecha_hora' => $registro->fecha_hora->format('Y-m-d H:i:s'),
                    'estado' => $registro->estado,
                    'motivo' => $registro->motivo,
                    'estudiante' => [
                        'id' => $registro->estudiante->id,
                        'nombre_completo' => $registro->estudiante->nombre_completo,
                        'grado_seccion' => $registro->estudiante->grado_seccion,
                    ],
                    'padre' => [
                        'id' => $registro->padre->id,
                        'nombre_completo' => $registro->padre->nombre_completo,
                        'email' => $registro->padre->email,
                    ],
                ];
            })
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'estudiante_id' => 'required|exists:estudiantes,id',
            'motivo' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $estudiante = Estudiante::find($request->estudiante_id);

        // Verificar que el padre puede hacer llamadas para este estudiante
        if (!$user->isAdmin() && !$estudiante->tienePadre($user)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar llamadas para este estudiante'
            ], 403);
        }

        // Verificar horario permitido
        if (!Configuracion::isHorarioPermitido()) {
            return response()->json([
                'success' => false,
                'message' => 'Las llamadas solo están permitidas en horario escolar'
            ], 422);
        }

        // Verificar límite de llamadas por día
        $llamadasHoy = RegistroSalida::where('padre_id', $user->id)
                                   ->where('estudiante_id', $request->estudiante_id)
                                   ->whereDate('fecha_hora', today())
                                   ->count();

        $maxLlamadas = Configuracion::getMaxLlamadasPorDia();
        
        if ($llamadasHoy >= $maxLlamadas) {
            return response()->json([
                'success' => false,
                'message' => "Has alcanzado el límite de {$maxLlamadas} llamadas por día para este estudiante"
            ], 422);
        }

        try {
            $registro = RegistroSalida::create([
                'estudiante_id' => $request->estudiante_id,
                'padre_id' => $user->id,
                'fecha_hora' => now(),
                'estado' => 'pendiente',
                'motivo' => $request->motivo,
            ]);

            $registro->load(['estudiante', 'padre']);

            return response()->json([
                'success' => true,
                'message' => 'Llamada registrada exitosamente',
                'data' => [
                    'id' => $registro->id,
                    'fecha_hora' => $registro->fecha_hora->format('Y-m-d H:i:s'),
                    'estado' => $registro->estado,
                    'motivo' => $registro->motivo,
                    'estudiante' => [
                        'id' => $registro->estudiante->id,
                        'nombre_completo' => $registro->estudiante->nombre_completo,
                        'grado_seccion' => $registro->estudiante->grado_seccion,
                    ],
                    'padre' => [
                        'id' => $registro->padre->id,
                        'nombre_completo' => $registro->padre->nombre_completo,
                        'email' => $registro->padre->email,
                    ],
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar la llamada'
            ], 500);
        }
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $registro = RegistroSalida::with(['estudiante', 'padre'])->find($id);
        
        if (!$registro) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado'
            ], 404);
        }

        // Verificar permisos
        if (!$user->isAdmin() && $registro->padre_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver este registro'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $registro->id,
                'fecha_hora' => $registro->fecha_hora->format('Y-m-d H:i:s'),
                'estado' => $registro->estado,
                'motivo' => $registro->motivo,
                'estudiante' => [
                    'id' => $registro->estudiante->id,
                    'nombre_completo' => $registro->estudiante->nombre_completo,
                    'grado_seccion' => $registro->estudiante->grado_seccion,
                ],
                'padre' => [
                    'id' => $registro->padre->id,
                    'nombre_completo' => $registro->padre->nombre_completo,
                    'email' => $registro->padre->email,
                ],
            ]
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        // Solo admins pueden cambiar el estado
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:confirmada,rechazada',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Estado inválido',
                'errors' => $validator->errors()
            ], 422);
        }

        $registro = RegistroSalida::with(['estudiante', 'padre'])->find($id);
        
        if (!$registro) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado'
            ], 404);
        }

        if (!$registro->isPendiente()) {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden modificar registros pendientes'
            ], 422);
        }

        try {
            $registro->update(['estado' => $request->estado]);

            return response()->json([
                'success' => true,
                'message' => "Llamada {$request->estado} exitosamente",
                'data' => [
                    'id' => $registro->id,
                    'fecha_hora' => $registro->fecha_hora->format('Y-m-d H:i:s'),
                    'estado' => $registro->estado,
                    'motivo' => $registro->motivo,
                    'estudiante' => [
                        'id' => $registro->estudiante->id,
                        'nombre_completo' => $registro->estudiante->nombre_completo,
                        'grado_seccion' => $registro->estudiante->grado_seccion,
                    ],
                    'padre' => [
                        'id' => $registro->padre->id,
                        'nombre_completo' => $registro->padre->nombre_completo,
                        'email' => $registro->padre->email,
                    ],
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado'
            ], 500);
        }
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $registro = RegistroSalida::find($id);
        
        if (!$registro) {
            return response()->json([
                'success' => false,
                'message' => 'Registro no encontrado'
            ], 404);
        }

        // Solo admins o el padre que hizo la llamada pueden eliminarla
        if (!$user->isAdmin() && $registro->padre_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este registro'
            ], 403);
        }

        // Solo se pueden eliminar registros pendientes
        if (!$registro->isPendiente()) {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden eliminar registros pendientes'
            ], 422);
        }

        try {
            $registro->delete();

            return response()->json([
                'success' => true,
                'message' => 'Registro eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el registro'
            ], 500);
        }
    }
}