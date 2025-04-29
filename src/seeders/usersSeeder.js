import { supabase } from '../lib/supabase.js'

const users = [
  {
    email: 'admin@colegio.com',
    password: 'admin123',
    role: 'admin',
    nombre: 'Administrador',
    apellido: 'Principal'
  },
  {
    email: 'padre1@colegio.com',
    password: 'padre123',
    role: 'padre',
    nombre: 'Padre',
    apellido: 'Ejemplo'
  },
  {
    email: 'padre2@colegio.com',
    password: 'padre123',
    role: 'padre',
    nombre: 'Padre',
    apellido: 'Secundario'
  }
]

export async function seedUsers() {
  try {
    // Verificar si la tabla existe
    const { data: tableExists, error: checkError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1)

    if (checkError && checkError.code !== '42P01') {
      throw checkError
    }

    // Si la tabla no existe, lanzar error ya que debería existir por las migraciones
    if (!tableExists) {
      throw new Error('La tabla de usuarios no existe. Por favor, ejecuta las migraciones primero.')
    }

    // Verificar y crear usuarios
    for (const user of users) {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', user.email)
        .single()

      if (existingUser) {
        console.log(`Usuario ${user.email} ya existe, omitiendo...`)
        continue
      }

      // Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        console.error(`Error al crear usuario ${user.email}:`, authError)
        continue
      }

      // Crear usuario en la tabla usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user.id,
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            rol: user.role
          }
        ])

      if (dbError) {
        console.error(`Error al insertar usuario ${user.email} en la base de datos:`, dbError)
        continue
      }

      console.log(`Usuario ${user.email} creado exitosamente`)
    }

    console.log('Seeder de usuarios completado')
  } catch (error) {
    console.error('Error en el seeder de usuarios:', error)
    throw error
  }
}

// No ejecutar automáticamente
// seedUsers() 