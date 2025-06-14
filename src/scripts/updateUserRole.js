import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar variables de entorno desde el directorio raíz del proyecto
dotenv.config({ path: resolve(__dirname, '../../.env') })

import { supabase } from '../lib/supabase.js'
import { VALID_ROLES, ROLE_NAMES } from '../config/roles.js'

/**
 * Actualiza el rol de un usuario existente
 * @param {string} email - Email del usuario
 * @param {string} newRole - Nuevo rol (debe estar en VALID_ROLES)
 */
async function updateUserRole(email, newRole) {
  try {
    // Validar que el rol sea válido usando configuración centralizada
    if (!VALID_ROLES.includes(newRole)) {
      throw new Error(`Rol inválido. Debe ser uno de: ${VALID_ROLES.join(', ')}`)
    }

    // Verificar si el usuario existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, role, nombre, apellido')
      .eq('email', email)
      .single()

    if (checkError || !existingUser) {
      console.error(`❌ Usuario con email ${email} no encontrado`)
      return false
    }

    console.log(`📋 Usuario encontrado:`)
    console.log(`   Email: ${existingUser.email}`)
    console.log(`   Nombre: ${existingUser.nombre} ${existingUser.apellido}`)
    console.log(`   Rol actual: ${ROLE_NAMES[existingUser.role] || existingUser.role}`)
    console.log(`   Nuevo rol: ${ROLE_NAMES[newRole] || newRole}`)

    // Si ya tiene el rol, no hacer nada
    if (existingUser.role === newRole) {
      console.log(`✅ El usuario ya tiene el rol '${ROLE_NAMES[newRole] || newRole}'`)
      return true
    }

    // Actualizar el rol
    const { data, error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('email', email)
      .select()

    if (error) {
      console.error('❌ Error al actualizar el rol:', error)
      return false
    }

    console.log(`✅ Rol actualizado exitosamente de '${ROLE_NAMES[existingUser.role] || existingUser.role}' a '${ROLE_NAMES[newRole] || newRole}'`)
    return true

  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

/**
 * Listar todos los usuarios y sus roles
 */
async function listAllUsers() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email, role, nombre, apellido')
      .order('email')

    if (error) {
      console.error('❌ Error al obtener usuarios:', error)
      return
    }

    console.log('\n📋 Lista de usuarios:')
    console.log('═'.repeat(80))
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   Nombre: ${user.nombre} ${user.apellido}`)
      console.log(`   Rol: ${ROLE_NAMES[user.role] || user.role}`)
      console.log('─'.repeat(40))
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log(`
🔧 Script para actualizar roles de usuarios

Uso:
  node updateUserRole.js <email> <nuevo-rol>
  node updateUserRole.js --list

Ejemplos:
  node updateUserRole.js usuario@colegio.com admin
  node updateUserRole.js profesor@colegio.com profesor
  node updateUserRole.js --list

Roles disponibles: ${VALID_ROLES.join(', ')}
    `)
    return
  }

  if (args[0] === '--list' || args[0] === '-l') {
    await listAllUsers()
    return
  }

  if (args.length !== 2) {
    console.error('❌ Error: Debes proporcionar email y nuevo rol')
    console.log('Ejemplo: node updateUserRole.js usuario@colegio.com admin')
    return
  }

  const [email, newRole] = args
  await updateUserRole(email, newRole)
}

// Ejecutar automáticamente
main().catch(console.error)

export { updateUserRole, listAllUsers } 