-- Corregir políticas RLS para la tabla users
-- Eliminar políticas previas si existen
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios datos" ON public.users;
DROP POLICY IF EXISTS "Los administradores pueden ver todos los datos" ON public.users;
DROP POLICY IF EXISTS "Los administradores pueden actualizar todos los datos" ON public.users;

-- Política: los usuarios pueden ver su propio perfil
CREATE POLICY "Los usuarios pueden ver sus propios datos"
    ON public.users FOR SELECT
    USING (id = auth.uid());

-- Política: los usuarios pueden actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar sus propios datos"
    ON public.users FOR UPDATE
    USING (id = auth.uid());

-- Política: los administradores pueden ver todos los datos
CREATE POLICY "Los administradores pueden ver todos los datos"
    ON public.users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users AS u
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

-- Política: los administradores pueden actualizar todos los datos
CREATE POLICY "Los administradores pueden actualizar todos los datos"
    ON public.users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users AS u
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    ); 