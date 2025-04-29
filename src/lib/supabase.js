import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar variables de entorno desde el directorio raíz del proyecto
dotenv.config({ path: resolve(__dirname, '../../.env') })

// Obtener las variables de entorno
let supabaseUrl, supabaseAnonKey

// Intentar obtener las variables de entorno de diferentes fuentes
try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        // Entorno Vite
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    } else {
        // Entorno Node.js
        supabaseUrl = process.env.VITE_SUPABASE_URL
        supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Variables de entorno no encontradas')
    }
} catch (error) {
    console.error('Error al cargar las variables de entorno:', error)
    throw new Error('Faltan las variables de entorno de Supabase. Por favor, verifica tu archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 