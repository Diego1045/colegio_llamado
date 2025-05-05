-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'profesor', 'estudiante')),
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Crear la función para actualizar el timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear el trigger para actualizar el timestamp
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'handle_users_updated_at'
    ) THEN
        CREATE TRIGGER handle_users_updated_at
            BEFORE UPDATE ON public.users
            FOR EACH ROW
            EXECUTE PROCEDURE public.handle_updated_at();
    END IF;
END;
$$;

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
-- CREATE POLICY "Los usuarios pueden ver sus propios datos"
--     ON public.users FOR SELECT
--     USING (auth.uid() = id);

-- CREATE POLICY "Los administradores pueden ver todos los datos"
--     ON public.users FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.users
--             WHERE id = auth.uid() AND role = 'admin'
--         )
--     );

-- CREATE POLICY "Los administradores pueden actualizar todos los datos"
--     ON public.users FOR UPDATE
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.users
--             WHERE id = auth.uid() AND role = 'admin'
--         )
--     ); 