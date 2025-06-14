-- Script para exportar datos de Supabase
-- Ejecutar en el SQL Editor de Supabase para obtener datos

-- 1. Exportar usuarios
SELECT 
  id,
  email,
  role,
  nombre,
  apellido,
  created_at,
  updated_at
FROM public.users 
ORDER BY created_at;

-- 2. Exportar estudiantes
SELECT 
  id,
  nombre,
  apellido,
  grado,
  seccion,
  created_at,
  updated_at
FROM estudiantes 
ORDER BY created_at;

-- 3. Exportar relaciones padre-estudiante
SELECT 
  id,
  padre_id,
  estudiante_id,
  created_at
FROM padres_estudiantes 
ORDER BY created_at;

-- 4. Exportar registros de salida
SELECT 
  id,
  estudiante_id,
  padre_id,
  fecha_hora,
  estado,
  motivo,
  created_at,
  updated_at
FROM registros_salida 
ORDER BY fecha_hora DESC;

-- 5. Exportar códigos de invitación
SELECT 
  id,
  codigo,
  estado,
  usado_por,
  created_at,
  updated_at
FROM codigos_invitacion 
ORDER BY created_at;

-- 6. Exportar configuración
SELECT 
  id,
  clave,
  valor,
  descripcion,
  created_at,
  updated_at
FROM configuracion 
ORDER BY clave;

-- 7. Exportar estadísticas
SELECT 
  id,
  fecha,
  total_estudiantes,
  total_padres,
  llamadas_realizadas,
  llamadas_confirmadas,
  llamadas_rechazadas,
  created_at,
  updated_at
FROM stats 
ORDER BY fecha DESC;

-- Conteos para verificación
SELECT 
  'users' as tabla,
  COUNT(*) as total
FROM public.users
UNION ALL
SELECT 
  'estudiantes' as tabla,
  COUNT(*) as total
FROM estudiantes
UNION ALL
SELECT 
  'padres_estudiantes' as tabla,
  COUNT(*) as total
FROM padres_estudiantes
UNION ALL
SELECT 
  'registros_salida' as tabla,
  COUNT(*) as total
FROM registros_salida
UNION ALL
SELECT 
  'codigos_invitacion' as tabla,
  COUNT(*) as total
FROM codigos_invitacion
UNION ALL
SELECT 
  'configuracion' as tabla,
  COUNT(*) as total
FROM configuracion
UNION ALL
SELECT 
  'stats' as tabla,
  COUNT(*) as total
FROM stats; 