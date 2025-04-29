# Tablas del Sistema

## 1. stats
- id (primary key)
- userCount (integer)
- codeCount (integer)

## 2. usuarios
- id (primary key)
- email (string, unique)
- password (string, hashed)
- nombre (string)
- apellido (string)
- rol (string) - 'padre' o 'admin'
- created_at (timestamp)
- updated_at (timestamp)

## 3. estudiantes
- id (primary key)
- nombre (string)
- apellido (string)
- grado (string)
- seccion (string)
- created_at (timestamp)
- updated_at (timestamp)

## 4. padres_estudiantes
- id (primary key)
- padre_id (foreign key -> usuarios.id)
- estudiante_id (foreign key -> estudiantes.id)
- created_at (timestamp)

## 5. registros_salida
- id (primary key)
- estudiante_id (foreign key -> estudiantes.id)
- padre_id (foreign key -> usuarios.id)
- fecha_hora (timestamp)
- estado (string) - 'pendiente', 'confirmado', 'completado'
- ubicacion_lat (float)
- ubicacion_lng (float)
- created_at (timestamp)
- updated_at (timestamp)

## 6. configuracion
- id (primary key)
- horario_inicio_salida (time)
- horario_fin_salida (time)
- radio_geocerca (integer) - en metros
- created_at (timestamp)
- updated_at (timestamp)
