import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Cargar variables de entorno
dotenv.config()

// Obtener variables de Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Error: Variables de entorno de Supabase no encontradas')
    console.log('Asegúrate de tener un archivo .env con:')
    console.log('VITE_SUPABASE_URL=tu_url_aqui')
    console.log('VITE_SUPABASE_ANON_KEY=tu_key_aqui')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Ver todos los usuarios
async function verUsuarios() {
    try {
        console.log('🔍 Buscando usuarios...\n')
        
        const { data: usuarios, error } = await supabase
            .from('users')
            .select('*')
            .order('email')

        if (error) {
            console.error('❌ Error:', error)
            return
        }

        console.log('👥 USUARIOS REGISTRADOS:')
        console.log('═'.repeat(60))
        
        usuarios.forEach((user, i) => {
            console.log(`${i + 1}. 📧 ${user.email}`)
            console.log(`   👤 ${user.nombre} ${user.apellido}`)
            console.log(`   🎭 Rol: ${user.role || 'Sin rol'}`)
            console.log(`   🆔 ID: ${user.id}`)
            console.log('─'.repeat(40))
        })
        
        console.log(`\n📊 Total: ${usuarios.length} usuarios`)
        
    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

// Ejecutar
verUsuarios() 