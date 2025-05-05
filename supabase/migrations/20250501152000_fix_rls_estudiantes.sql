-- Eliminar la policy problemática que causa recursión
DROP POLICY IF EXISTS "Los administradores pueden gestionar estudiantes" ON estudiantes; 