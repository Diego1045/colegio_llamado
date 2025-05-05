import { supabase } from '../supabase.js'

const actualizarRegistrosSalida = async () => {
    console.log('Ejecutando migración: actualizar tabla registros_salida')

    try {
        // Primero verificamos si los campos ya existen para evitar errores
        const { data: columnas, error: errorColumnas } = await supabase
            .from('registros_salida')
            .select('tipo')
            .limit(1)
            .maybeSingle()

        const columnasTipoExiste = !errorColumnas

        // Si no existe el campo 'tipo', añadirlo
        if (!columnasTipoExiste) {
            console.log('Añadiendo campo tipo a registros_salida')

            // Añadir campo 'tipo' (normal/manual)
            const { error: errorTipo } = await supabase.rpc('execute_sql', {
                query: `ALTER TABLE "registros_salida" ADD COLUMN IF NOT EXISTS "tipo" TEXT DEFAULT 'normal';`
            })

            if (errorTipo) {
                throw new Error(`Error al añadir campo tipo: ${errorTipo.message}`)
            }

            // Añadir campos para anuncios manuales
            const { error: errorCamposManuales } = await supabase.rpc('execute_sql', {
                query: `
          ALTER TABLE "registros_salida" 
          ADD COLUMN IF NOT EXISTS "nombre_manual" TEXT,
          ADD COLUMN IF NOT EXISTS "apellido_manual" TEXT,
          ADD COLUMN IF NOT EXISTS "grado_manual" TEXT,
          ADD COLUMN IF NOT EXISTS "seccion_manual" TEXT,
          ADD COLUMN IF NOT EXISTS "anunciado_por" UUID REFERENCES "auth"."users" (id);
        `
            })

            if (errorCamposManuales) {
                throw new Error(`Error al añadir campos para anuncios manuales: ${errorCamposManuales.message}`)
            }

            // Actualizar campo 'estado' para incluir el nuevo estado 'anunciado'
            console.log('Actualizando posibles valores de estado')

            // Primero verificamos si el tipo ENUM ya existe y cómo está definido
            const { data: enumCheck, error: errorEnum } = await supabase.rpc('execute_sql_with_result', {
                query: `
          SELECT enum_range(NULL::estado_registro)::text AS estados;
        `
            })

            // Si el tipo ENUM no existe o no tiene 'anunciado', lo actualizamos
            if (errorEnum || !enumCheck[0].estados.includes('anunciado')) {
                // Creamos o actualizamos el tipo enum para estados de registro
                const { error: errorTipoEnum } = await supabase.rpc('execute_sql', {
                    query: `
            DO $$
            BEGIN
              IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_registro') THEN
                -- El tipo ya existe, lo alteramos
                ALTER TYPE estado_registro ADD VALUE IF NOT EXISTS 'anunciado';
              ELSE
                -- El tipo no existe, lo creamos
                CREATE TYPE estado_registro AS ENUM ('pendiente', 'anunciado', 'completado', 'cancelado');
                
                -- Convertimos la columna al nuevo tipo enum
                ALTER TABLE "registros_salida" 
                  ALTER COLUMN "estado" TYPE estado_registro 
                    USING estado::estado_registro;
              END IF;
            END
            $$;
          `
                })

                if (errorTipoEnum) {
                    throw new Error(`Error al actualizar tipo enum estado_registro: ${errorTipoEnum.message}`)
                }
            }

            console.log('Migración de registros_salida completada con éxito')
        } else {
            console.log('La tabla registros_salida ya tiene los campos necesarios')
        }

    } catch (error) {
        console.error('Error en la migración de registros_salida:', error.message)
        throw error
    }
}

export default actualizarRegistrosSalida 