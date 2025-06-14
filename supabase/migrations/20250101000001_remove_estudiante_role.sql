-- Actualizar restricción de roles para eliminar 'estudiante'
-- Solo cambia la restricción, NO modifica datos existentes

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'profesor', 'padre')); 

-- Agregar comentario explicativo
COMMENT ON CONSTRAINT users_role_check ON public.users IS 'Roles permitidos: admin, profesor, padre (representante)'; 