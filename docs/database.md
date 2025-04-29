# Estructura de la Base de Datos

## Tablas

### usuarios
- `id` (UUID): Identificador único del usuario
- `nombre` (VARCHAR): Nombre del usuario
- `apellido` (VARCHAR): Apellido del usuario
- `email` (VARCHAR): Email único del usuario
- `rol` (rol_usuario): Rol del usuario (admin o padre)
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

### estudiantes
- `id` (UUID): Identificador único del estudiante
- `nombre` (VARCHAR): Nombre del estudiante
- `apellido` (VARCHAR): Apellido del estudiante
- `grado` (VARCHAR): Grado del estudiante
- `seccion` (VARCHAR): Sección del estudiante
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

### padres_estudiantes
- `id` (UUID): Identificador único de la relación
- `padre_id` (UUID): ID del padre (referencia a usuarios)
- `estudiante_id` (UUID): ID del estudiante (referencia a estudiantes)
- `created_at` (TIMESTAMP): Fecha de creación

### registros_salida
- `id` (UUID): Identificador único del registro
- `estudiante_id` (UUID): ID del estudiante
- `padre_id` (UUID): ID del padre que realiza la llamada
- `fecha_hora` (TIMESTAMP): Fecha y hora de la llamada
- `estado` (estado_llamada): Estado de la llamada
- `motivo` (TEXT): Motivo de la llamada (opcional)
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

### codigos_invitacion
- `id` (UUID): Identificador único del código
- `codigo` (VARCHAR): Código de invitación único
- `estado` (estado_codigo): Estado del código
- `usado_por` (UUID): ID del usuario que usó el código (opcional)
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

### configuracion
- `id` (UUID): Identificador único de la configuración
- `clave` (VARCHAR): Clave única de la configuración
- `valor` (TEXT): Valor de la configuración
- `descripcion` (TEXT): Descripción de la configuración
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

### stats
- `id` (UUID): Identificador único de la estadística
- `fecha` (DATE): Fecha de la estadística
- `total_estudiantes` (INTEGER): Total de estudiantes
- `total_padres` (INTEGER): Total de padres
- `llamadas_realizadas` (INTEGER): Total de llamadas realizadas
- `llamadas_confirmadas` (INTEGER): Total de llamadas confirmadas
- `llamadas_rechazadas` (INTEGER): Total de llamadas rechazadas
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de última actualización

## Tipos de Datos Personalizados

### rol_usuario
- `admin`: Usuario administrador
- `padre`: Usuario padre de familia

### estado_llamada
- `pendiente`: Llamada pendiente de confirmación
- `confirmada`: Llamada confirmada
- `rechazada`: Llamada rechazada

### estado_codigo
- `disponible`: Código disponible para uso
- `usado`: Código ya utilizado
- `invalido`: Código invalidado

## Índices

### usuarios
- `idx_usuarios_email`: Índice en el campo email

### estudiantes
- `idx_estudiantes_grado`: Índice en el campo grado

### registros_salida
- `idx_registros_salida_fecha`: Índice en el campo fecha_hora
- `idx_registros_salida_estado`: Índice en el campo estado

### codigos_invitacion
- `idx_codigos_invitacion_estado`: Índice en el campo estado

### stats
- `idx_stats_fecha`: Índice en el campo fecha

## Políticas de Seguridad (RLS)

### usuarios
- Los usuarios pueden ver su propio perfil
- Los administradores pueden ver todos los usuarios
- Los administradores pueden crear usuarios
- Los usuarios pueden actualizar su propio perfil

### estudiantes
- Los administradores pueden gestionar estudiantes
- Los padres pueden ver sus estudiantes

### padres_estudiantes
- Los administradores pueden gestionar relaciones padre-estudiante

### registros_salida
- Los administradores pueden gestionar registros de salida
- Los padres pueden ver y crear registros de salida de sus estudiantes
- Los padres pueden crear registros de salida

### codigos_invitacion
- Los administradores pueden gestionar códigos de invitación
- Los usuarios pueden ver códigos disponibles

### configuracion
- Los administradores pueden gestionar la configuración

### stats
- Los administradores pueden gestionar estadísticas 