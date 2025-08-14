import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

// Configuración directa (reemplaza con tus valores reales)
const supabaseUrl = 'YOUR_SUPABASE_URL'  // Reemplaza con tu URL de Supabase
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'  // Reemplaza con tu clave anónima

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdmin() {
  try {
    console.log('🚀 Creando cuenta de administrador...')
    
    const adminData = {
      email: 'admin@colegio.com',
      password: 'Admin123!',
      role: 'admin',
      nombre: 'Administrador',
      apellido: 'Principal'
    }

    // Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminData.email,
      password: adminData.password,
      options: {
        data: {
          role: adminData.role,
          nombre: adminData.nombre,
          apellido: adminData.apellido
        }
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ El usuario administrador ya existe')
        console.log('📧 Email: admin@colegio.com')
        console.log('🔐 Contraseña: Admin123!')
        return
      }
      throw authError
    }

    console.log('✅ Cuenta de administrador creada exitosamente!')
    console.log('📧 Email: admin@colegio.com')
    console.log('🔐 Contraseña: Admin123!')
    
  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message)
    
    // Mostrar información de las credenciales existentes
    console.log('\n📋 CREDENCIALES DE ADMINISTRADOR:')
    console.log('📧 Email: admin@colegio.com')
    console.log('🔐 Contraseña: Admin123!')
    console.log('\n⚠️  Si estas credenciales no funcionan, puede que necesites:')
    console.log('   1. Configurar las variables de entorno de Supabase')
    console.log('   2. Crear el usuario manualmente desde Supabase Dashboard')
  }
}

createAdmin()
