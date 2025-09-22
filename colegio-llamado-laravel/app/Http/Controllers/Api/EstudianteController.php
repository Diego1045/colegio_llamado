<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Estudiante;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class EstudianteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($user->isAdmin()) {
            // Los admins pueden ver todos los estudiantes
            $estudiantes = Estudiante::with('padres')->get();
        } else {
            // Los padres solo ven sus estudiantes
            $estudiantes = $user->estudiantes()->get();
        }

        return response()->json([
            'success' => true,
            'data' => $estudiantes->map(function ($estudiante) {
                return [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre,
                    'apellido' => $estudiante->apellido,
                    'nombre_completo' => $estudiante->nombre_completo,
                    'grado' => $estudiante->grado,
                    'seccion' => $estudiante->seccion,
                    'grado_seccion' => $estudiante->grado_seccion,
                    'padres' => $estudiante->padres->map(function ($padre) {
                        return [
                            'id' => $padre->id,
                            'nombre_completo' => $padre->nombre_completo,
                            'email' => $padre->email,
                        ];
                    }),
                ];
            })
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // Solo admins pueden crear estudiantes
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'grado' => 'required|string|max:10',
            'seccion' => 'required|string|max:10',
            'padres' => 'array',
            'padres.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $estudiante = Estudiante::create([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'grado' => $request->grado,
                'seccion' => $request->seccion,
            ]);

            // Asociar padres si se proporcionaron
            if ($request->has('padres')) {
                $padres = User::whereIn('id', $request->padres)
                            ->where('role', 'padre')
                            ->pluck('id');
                $estudiante->padres()->attach($padres);
            }

            $estudiante->load('padres');

            return response()->json([
                'success' => true,
                'message' => 'Estudiante creado exitosamente',
                'data' => [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre,
                    'apellido' => $estudiante->apellido,
                    'nombre_completo' => $estudiante->nombre_completo,
                    'grado' => $estudiante->grado,
                    'seccion' => $estudiante->seccion,
                    'grado_seccion' => $estudiante->grado_seccion,
                    'padres' => $estudiante->padres->map(function ($padre) {
                        return [
                            'id' => $padre->id,
                            'nombre_completo' => $padre->nombre_completo,
                            'email' => $padre->email,
                        ];
                    }),
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el estudiante'
            ], 500);
        }
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $estudiante = Estudiante::with('padres')->find($id);
        
        if (!$estudiante) {
            return response()->json([
                'success' => false,
                'message' => 'Estudiante no encontrado'
            ], 404);
        }

        // Verificar permisos
        if (!$user->isAdmin() && !$estudiante->tienePadre($user)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para ver este estudiante'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $estudiante->id,
                'nombre' => $estudiante->nombre,
                'apellido' => $estudiante->apellido,
                'nombre_completo' => $estudiante->nombre_completo,
                'grado' => $estudiante->grado,
                'seccion' => $estudiante->seccion,
                'grado_seccion' => $estudiante->grado_seccion,
                'padres' => $estudiante->padres->map(function ($padre) {
                    return [
                        'id' => $padre->id,
                        'nombre_completo' => $padre->nombre_completo,
                        'email' => $padre->email,
                    ];
                }),
            ]
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        // Solo admins pueden actualizar estudiantes
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción'
            ], 403);
        }

        $estudiante = Estudiante::find($id);
        
        if (!$estudiante) {
            return response()->json([
                'success' => false,
                'message' => 'Estudiante no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:100',
            'apellido' => 'sometimes|required|string|max:100',
            'grado' => 'sometimes|required|string|max:10',
            'seccion' => 'sometimes|required|string|max:10',
            'padres' => 'array',
            'padres.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $estudiante->update($request->only(['nombre', 'apellido', 'grado', 'seccion']));

            // Actualizar padres si se proporcionaron
            if ($request->has('padres')) {
                $padres = User::whereIn('id', $request->padres)
                            ->where('role', 'padre')
                            ->pluck('id');
                $estudiante->padres()->sync($padres);
            }

            $estudiante->load('padres');

            return response()->json([
                'success' => true,
                'message' => 'Estudiante actualizado exitosamente',
                'data' => [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre,
                    'apellido' => $estudiante->apellido,
                    'nombre_completo' => $estudiante->nombre_completo,
                    'grado' => $estudiante->grado,
                    'seccion' => $estudiante->seccion,
                    'grado_seccion' => $estudiante->grado_seccion,
                    'padres' => $estudiante->padres->map(function ($padre) {
                        return [
                            'id' => $padre->id,
                            'nombre_completo' => $padre->nombre_completo,
                            'email' => $padre->email,
                        ];
                    }),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estudiante'
            ], 500);
        }
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        // Solo admins pueden eliminar estudiantes
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción'
            ], 403);
        }

        $estudiante = Estudiante::find($id);
        
        if (!$estudiante) {
            return response()->json([
                'success' => false,
                'message' => 'Estudiante no encontrado'
            ], 404);
        }

        try {
            $estudiante->delete();

            return response()->json([
                'success' => true,
                'message' => 'Estudiante eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el estudiante'
            ], 500);
        }
    }
}