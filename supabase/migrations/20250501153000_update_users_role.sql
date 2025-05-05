-- Actualizar la restricción de roles en la tabla users para incluir 'padre'
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'profesor', 'estudiante', 'padre')); 