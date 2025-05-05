-- Eliminar la policy problemática que causa recursión
DROP POLICY IF EXISTS "Los administradores pueden gestionar relaciones padre-estudiant" ON padres_estudiantes;

-- Crear una policy segura para los padres
CREATE POLICY "Padres pueden gestionar sus relaciones"
    ON padres_estudiantes FOR ALL
    USING (padre_id = auth.uid()); 