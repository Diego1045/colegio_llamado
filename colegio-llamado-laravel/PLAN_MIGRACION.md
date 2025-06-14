# Plan de Migración: Supabase a Laravel

## 📋 Resumen del Sistema Actual

Tu sistema actual tiene las siguientes funcionalidades:
- **Autenticación con roles**: admin, padre
- **Gestión de estudiantes**: información personal, grado, sección
- **Relaciones padre-estudiante**: un padre puede tener múltiples hijos
- **Registros de salida**: llamadas para retirar estudiantes
- **Códigos de invitación**: sistema de invitaciones para padres
- **Configuración del sistema**: ajustes generales
- **Estadísticas**: métricas del sistema

## 🏗️ Estructura de Base de Datos Actual (Supabase)

### Tablas identificadas:
1. **users** - Usuarios (admin, padre)
2. **estudiantes** - Información de estudiantes
3. **padres_estudiantes** - Relación muchos a muchos
4. **registros_salida** - Llamadas de salida
5. **codigos_invitacion** - Códigos de invitación
6. **configuracion** - Configuración del sistema
7. **stats** - Estadísticas

## 🎯 Plan de Migración a Laravel

### Fase 1: Configuración Inicial de Laravel
- [ ] Instalar Laravel 10/11
- [ ] Configurar base de datos (MySQL/PostgreSQL)
- [ ] Instalar paquetes necesarios
- [ ] Configurar autenticación

### Fase 2: Migraciones de Base de Datos
Crear migraciones Laravel equivalentes:

#### 2.1 Migración: users
```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('email')->unique();
    $table->enum('role', ['admin', 'padre']);
    $table->string('nombre');
    $table->string('apellido');
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

#### 2.2 Migración: estudiantes
```php
Schema::create('estudiantes', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('nombre', 100);
    $table->string('apellido', 100);
    $table->string('grado', 10);
    $table->string('seccion', 10);
    $table->timestamps();
});
```

#### 2.3 Migración: padres_estudiantes
```php
Schema::create('padres_estudiantes', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('padre_id');
    $table->uuid('estudiante_id');
    $table->timestamps();
    
    $table->foreign('padre_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('estudiante_id')->references('id')->on('estudiantes')->onDelete('cascade');
    $table->unique(['padre_id', 'estudiante_id']);
});
```

#### 2.4 Migración: registros_salida
```php
Schema::create('registros_salida', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('estudiante_id');
    $table->uuid('padre_id');
    $table->timestamp('fecha_hora');
    $table->enum('estado', ['pendiente', 'confirmada', 'rechazada'])->default('pendiente');
    $table->text('motivo')->nullable();
    $table->timestamps();
    
    $table->foreign('estudiante_id')->references('id')->on('estudiantes')->onDelete('cascade');
    $table->foreign('padre_id')->references('id')->on('users')->onDelete('cascade');
});
```

#### 2.5 Migración: codigos_invitacion
```php
Schema::create('codigos_invitacion', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('codigo', 20)->unique();
    $table->enum('estado', ['disponible', 'usado', 'invalido'])->default('disponible');
    $table->uuid('usado_por')->nullable();
    $table->timestamps();
    
    $table->foreign('usado_por')->references('id')->on('users')->nullOnDelete();
});
```

#### 2.6 Migración: configuracion
```php
Schema::create('configuracion', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('clave', 50)->unique();
    $table->text('valor');
    $table->text('descripcion')->nullable();
    $table->timestamps();
});
```

#### 2.7 Migración: stats
```php
Schema::create('stats', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->date('fecha')->unique();
    $table->integer('total_estudiantes')->default(0);
    $table->integer('total_padres')->default(0);
    $table->integer('llamadas_realizadas')->default(0);
    $table->integer('llamadas_confirmadas')->default(0);
    $table->integer('llamadas_rechazadas')->default(0);
    $table->timestamps();
});
```

### Fase 3: Modelos Eloquent
Crear modelos Laravel para cada tabla:

- [ ] User (con roles)
- [ ] Estudiante
- [ ] PadreEstudiante (pivot)
- [ ] RegistroSalida
- [ ] CodigoInvitacion
- [ ] Configuracion
- [ ] Stat

### Fase 4: Autenticación y Autorización
- [ ] Configurar Laravel Sanctum para API
- [ ] Implementar middleware de roles
- [ ] Crear policies para cada modelo
- [ ] Migrar sistema de autenticación

### Fase 5: APIs REST
Crear endpoints para:
- [ ] Autenticación (login, register, logout)
- [ ] Gestión de estudiantes (CRUD)
- [ ] Gestión de relaciones padre-estudiante
- [ ] Sistema de llamadas/registros de salida
- [ ] Sistema de códigos de invitación
- [ ] Dashboard con estadísticas

### Fase 6: Migración de Datos
- [ ] Script para exportar datos de Supabase
- [ ] Script para importar datos a Laravel
- [ ] Verificación de integridad de datos

### Fase 7: Frontend (Mantener Vue.js)
- [ ] Adaptar frontend Vue para usar APIs de Laravel
- [ ] Actualizar configuración de autenticación
- [ ] Implementar manejo de errores Laravel
- [ ] Testing de integración

## 🛠️ Paquetes Laravel Recomendados

```json
{
    "require": {
        "laravel/framework": "^10.0",
        "laravel/sanctum": "^3.0",
        "spatie/laravel-permission": "^5.0",
        "ramsey/uuid": "^4.0"
    }
}
```

## ⚙️ Configuración Recomendada

### Base de Datos
- **MySQL 8.0+** o **PostgreSQL 14+**
- Usar UUIDs como primary keys (igual que Supabase)

### Autenticación
- **Laravel Sanctum** para autenticación API
- **Spatie Permission** para manejo de roles

### Estructura del Proyecto
```
laravel-app/
├── app/
│   ├── Models/
│   ├── Http/Controllers/Api/
│   ├── Http/Middleware/
│   └── Policies/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
```

## 🚀 Pasos Inmediatos

1. **Instalar PHP y Composer** (sigue las instrucciones manuales arriba)
2. **Crear nuevo proyecto Laravel**:
   ```bash
   composer create-project laravel/laravel colegio-llamado-backend
   ```
3. **Configurar base de datos local** (MySQL via XAMPP)
4. **Ejecutar migraciones**
5. **Configurar autenticación**

## 📋 Checklist de Migración

- [ ] PHP y Composer instalados
- [ ] Proyecto Laravel creado
- [ ] Base de datos configurada
- [ ] Migraciones ejecutadas
- [ ] Modelos creados
- [ ] Autenticación configurada
- [ ] APIs básicas funcionando
- [ ] Frontend conectado
- [ ] Datos migrados
- [ ] Testing completado
- [ ] Deploy a producción

¿Quieres que empecemos con alguna fase específica mientras instalas PHP y Composer? 