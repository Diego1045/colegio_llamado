import { supabase } from '../supabase.js'
import { DEFAULT_ROLE, isValidRole } from '../config/roles.js'

/**
 * Crea un nuevo usuario en la tabla users con rol por defecto desde configuración
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.id - ID del usuario de auth
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.nombre - Nombre del usuario
 * @param {string} userData.apellido - Apellido del usuario
 * @param {string} [userData.role] - Rol del usuario (por defecto usa DEFAULT_ROLE)
 */
export async function crearUsuarioEnTabla(userData) {
  const { id, email, nombre, apellido, role = DEFAULT_ROLE } = userData
  
  // Validar que el rol sea válido
  if (!isValidRole(role)) {
    throw new Error(`Rol inválido: ${role}. Solo se pueden usar roles definidos en la configuración.`)
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id,
          email: email.toLowerCase().trim(),
          nombre,
          apellido,
          role
        }
      ])
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al crear usuario en tabla:', error)
    return { data: null, error }
  }
}

/**
 * Registra un nuevo usuario con rol por defecto desde configuración
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {Object} userData - Datos adicionales del usuario
 * @param {string} [userData.role] - Rol del usuario (por defecto usa DEFAULT_ROLE)
 */
export async function registrarUsuario(email, password, userData = {}) {
  try {
    // Establecer datos por defecto desde configuración centralizada
    const defaultData = {
      role: DEFAULT_ROLE,
      ...userData
    }

    // Validar que el rol sea válido
    if (!isValidRole(defaultData.role)) {
      throw new Error(`Rol inválido: ${defaultData.role}. Solo se pueden usar roles definidos en la configuración.`)
    }

    // Registrar en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: defaultData
      }
    })

    if (authError) throw authError

    // Crear usuario en la tabla users
    if (authData.user) {
      const { error: dbError } = await crearUsuarioEnTabla({
        id: authData.user.id,
        email,
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        role: defaultData.role
      })

      if (dbError) {
        console.error('Error al crear usuario en base de datos:', dbError)
        // No lanzamos error aquí para no bloquear el registro en auth
      }
    }

    return { data: authData, error: null }
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return { data: null, error }
  }
} 