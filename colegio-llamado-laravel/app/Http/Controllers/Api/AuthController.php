<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CodigoInvitacion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->nombre,
                    'apellido' => $user->apellido,
                    'email' => $user->email,
                    'role' => $user->role,
                    'nombre_completo' => $user->nombre_completo,
                ],
                'token' => $token,
            ]
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'codigo_invitacion' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Validar código de invitación
        $codigo = CodigoInvitacion::validarCodigo($request->codigo_invitacion);
        if (!$codigo) {
            return response()->json([
                'success' => false,
                'message' => 'Código de invitación inválido o ya utilizado'
            ], 422);
        }

        try {
            $user = User::create([
                'nombre' => $request->nombre,
                'apellido' => $request->apellido,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'padre', // Por defecto los registros son padres
            ]);

            // Marcar código como usado
            $codigo->usar($user);

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registro exitoso',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'nombre' => $user->nombre,
                        'apellido' => $user->apellido,
                        'email' => $user->email,
                        'role' => $user->role,
                        'nombre_completo' => $user->nombre_completo,
                    ],
                    'token' => $token,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el usuario'
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->nombre,
                    'apellido' => $user->apellido,
                    'email' => $user->email,
                    'role' => $user->role,
                    'nombre_completo' => $user->nombre_completo,
                ]
            ]
        ]);
    }

    public function validateInvitationCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'codigo' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Código requerido',
                'errors' => $validator->errors()
            ], 422);
        }

        $codigo = CodigoInvitacion::validarCodigo($request->codigo);

        return response()->json([
            'success' => true,
            'data' => [
                'valid' => $codigo !== null,
                'message' => $codigo ? 'Código válido' : 'Código inválido o ya utilizado'
            ]
        ]);
    }
}