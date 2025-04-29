import { supabase } from '../lib/supabase.js'

const users = [
  {
    email: 't@colegio.com',
    password: 'u',
    role: 'admin',
    nombre: 'Administrador',
    apellido: 'Principal'
  },
  {
    email: 'profesor@colegio.com',
    password: 'profesor123',
    role: 'profesor',
    nombre: 'Profesor',
    apellido: 'Ejemplo'
  },
  {
    email: 'estudiante@colegio.com',
    password: 'estudiante123',
    role: 'estudiante',
    nombre: 'Estudiante',
    apellido: 'Ejemplo'
  }
]

export async function seedUsers() {
  try {
    // Primero, verificar si la tabla existe
    const { data: tableExists, error: checkError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (checkError && checkError.code !== '42P01') { // 42P01 es el código de error cuando la tabla no existe
      throw checkError
    }

    // Si la tabla no existe, crearla
    if (!tableExists) {
      const { error: createError } = await supabase.rpc('create_users_table')
      if (createError) throw createError
    }

    // Insertar usuarios
    for (const user of users) {
      const { error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            role: user.role,
            nombre: user.nombre,
            apellido: user.apellido
          }
        }
      })

      if (error) {
        console.error(`Error al crear usuario ${user.email}:`, error)
      } else {
        console.log(`Usuario ${user.email} creado exitosamente`)
      }
    }

    console.log('Seeder de usuarios completado')
  } catch (error) {
    console.error('Error en el seeder de usuarios:', error)
  }
}

// Ejecutar el seeder
seedUsers() 