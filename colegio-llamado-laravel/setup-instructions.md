# Instrucciones de Configuración - Laravel Backend

## Prerequisitos Completados
- [ ] PHP 8.1+ instalado
- [ ] Composer instalado  
- [ ] MySQL/PostgreSQL disponible (via XAMPP)

## Paso 1: Crear Proyecto Laravel

```bash
composer create-project laravel/laravel colegio-llamado-backend
cd colegio-llamado-backend
```

## Paso 2: Instalar Dependencias Adicionales

```bash
composer require laravel/sanctum
composer require spatie/laravel-permission
composer require ramsey/uuid
```

## Paso 3: Configurar Base de Datos

### Editar `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=colegio_llamado
DB_USERNAME=root
DB_PASSWORD=

# Para UUIDs
MIX_ENABLE_UUID=true
```

### Crear base de datos:
```sql
CREATE DATABASE colegio_llamado CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Paso 4: Configurar Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Editar `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1')),
```

## Paso 5: Crear Migraciones

### Users Migration:
```bash
php artisan make:migration create_users_table_custom
```

### Estudiantes Migration:
```bash
php artisan make:migration create_estudiantes_table
```

### Padres Estudiantes Migration:
```bash
php artisan make:migration create_padres_estudiantes_table
```

### Registros Salida Migration:
```bash
php artisan make:migration create_registros_salida_table
```

### Códigos Invitación Migration:
```bash
php artisan make:migration create_codigos_invitacion_table
```

### Configuración Migration:
```bash
php artisan make:migration create_configuracion_table
```

### Stats Migration:
```bash
php artisan make:migration create_stats_table
```

## Paso 6: Crear Modelos

```bash
php artisan make:model Estudiante
php artisan make:model PadreEstudiante
php artisan make:model RegistroSalida
php artisan make:model CodigoInvitacion
php artisan make:model Configuracion
php artisan make:model Stat
```

## Paso 7: Crear Controladores API

```bash
php artisan make:controller Api/AuthController
php artisan make:controller Api/EstudianteController --api
php artisan make:controller Api/RegistroSalidaController --api
php artisan make:controller Api/CodigoInvitacionController --api
php artisan make:controller Api/ConfiguracionController --api
php artisan make:controller Api/StatsController --api
```

## Paso 8: Configurar Rutas API

Editar `routes/api.php`:
```php
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    Route::apiResource('estudiantes', EstudianteController::class);
    Route::apiResource('registros-salida', RegistroSalidaController::class);
    Route::apiResource('codigos-invitacion', CodigoInvitacionController::class);
    Route::apiResource('configuracion', ConfiguracionController::class);
    Route::get('/stats', [StatsController::class, 'index']);
});
```

## Paso 9: Configurar CORS

```bash
php artisan make:middleware Cors
```

Editar `app/Http/Kernel.php`:
```php
protected $middleware = [
    // ...
    \App\Http\Middleware\Cors::class,
];
```

## Paso 10: Ejecutar Migraciones

```bash
php artisan migrate
```

## Paso 11: Crear Seeders (Opcional)

```bash
php artisan make:seeder UserSeeder
php artisan make:seeder EstudianteSeeder
php artisan make:seeder ConfiguracionSeeder
```

## Paso 12: Iniciar Servidor

```bash
php artisan serve
```

El servidor estará disponible en: `http://localhost:8000`

## Paso 13: Configurar Frontend Vue

En tu proyecto Vue actual, actualizar `src/supabase.js` para apuntar a Laravel:

```javascript
// Reemplazar configuración de Supabase con configuración de Laravel
const API_URL = 'http://localhost:8000/api'

export const api = {
  // Métodos para comunicarse con Laravel
}
```

## Testing

```bash
# Crear tests
php artisan make:test AuthTest
php artisan make:test EstudianteTest

# Ejecutar tests
php artisan test
```

## Comandos Útiles

```bash
# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver rutas
php artisan route:list

# Crear nuevo usuario admin
php artisan tinker
>>> User::create([...])
```

## Próximos Pasos

1. Implementar todas las migraciones
2. Configurar modelos con relaciones
3. Implementar controllers con lógica de negocio
4. Crear middleware de autorización
5. Migrar datos desde Supabase
6. Actualizar frontend Vue
7. Testing completo
8. Deploy a producción

## Notas Importantes

- Usar UUIDs como primary keys (igual que Supabase)
- Mantener la misma estructura de roles y permisos
- Implementar validaciones de entrada
- Manejar errores apropiadamente
- Logging para debugging 