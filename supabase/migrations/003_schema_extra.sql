-- Crear tipos ENUM
CREATE TYPE rol_usuario AS ENUM ('admin', 'padre');
CREATE TYPE estado_llamada AS ENUM ('pendiente', 'confirmada', 'rechazada');
CREATE TYPE estado_codigo AS ENUM ('disponible', 'usado', 'invalido');

-- Crear tabla estudiantes
CREATE TABLE estudiantes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    grado VARCHAR(10) NOT NULL,
    seccion VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla padres_estudiantes (relación)
CREATE TABLE padres_estudiantes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    padre_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    estudiante_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(padre_id, estudiante_id)
);

-- Crear tabla registros_salida
CREATE TABLE registros_salida (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estudiante_id UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    padre_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado estado_llamada NOT NULL DEFAULT 'pendiente',
    motivo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla codigos_invitacion
CREATE TABLE codigos_invitacion (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    estado estado_codigo NOT NULL DEFAULT 'disponible',
    usado_por UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla configuracion
CREATE TABLE configuracion (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clave VARCHAR(50) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla stats
CREATE TABLE stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fecha DATE NOT NULL,
    total_estudiantes INTEGER NOT NULL DEFAULT 0,
    total_padres INTEGER NOT NULL DEFAULT 0,
    llamadas_realizadas INTEGER NOT NULL DEFAULT 0,
    llamadas_confirmadas INTEGER NOT NULL DEFAULT 0,
    llamadas_rechazadas INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(fecha)
);

-- Crear índices
CREATE INDEX idx_estudiantes_grado ON estudiantes(grado);
CREATE INDEX idx_registros_salida_fecha ON registros_salida(fecha_hora);
CREATE INDEX idx_registros_salida_estado ON registros_salida(estado);
CREATE INDEX idx_codigos_invitacion_estado ON codigos_invitacion(estado);
CREATE INDEX idx_stats_fecha ON stats(fecha);

-- Función y trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_estudiantes_updated_at
  BEFORE UPDATE ON estudiantes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registros_salida_updated_at
  BEFORE UPDATE ON registros_salida
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_codigos_invitacion_updated_at
  BEFORE UPDATE ON codigos_invitacion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_updated_at
  BEFORE UPDATE ON configuracion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE padres_estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_salida ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_invitacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajusta según tus necesidades)
CREATE POLICY "Los administradores pueden gestionar estudiantes"
    ON estudiantes FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Los padres pueden ver sus estudiantes"
    ON estudiantes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM padres_estudiantes
        WHERE padre_id = auth.uid() AND estudiante_id = estudiantes.id
    ));

CREATE POLICY "Los administradores pueden gestionar relaciones padre-estudiante"
    ON padres_estudiantes FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Los administradores pueden gestionar registros de salida"
    ON registros_salida FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Los padres pueden ver y crear registros de salida de sus estudiantes"
    ON registros_salida FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM padres_estudiantes
        WHERE padre_id = auth.uid() AND estudiante_id = registros_salida.estudiante_id
    ));

CREATE POLICY "Los padres pueden crear registros de salida"
    ON registros_salida FOR INSERT
    WITH CHECK (padre_id = auth.uid());

CREATE POLICY "Los administradores pueden gestionar códigos de invitación"
    ON codigos_invitacion FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Los usuarios pueden ver códigos disponibles"
    ON codigos_invitacion FOR SELECT
    USING (estado = 'disponible');

CREATE POLICY "Los administradores pueden gestionar la configuración"
    ON configuracion FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Los administradores pueden gestionar estadísticas"
    ON stats FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )); 