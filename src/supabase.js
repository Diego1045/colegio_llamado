import { createClient } from '@supabase/supabase-js'
import { DEFAULT_ROLE } from './config/roles.js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { supabase }

// Funciones de autenticación
export const auth = {
  // Iniciar sesión con email y contraseña
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  },

  // Registrarse con email y contraseña
  signUp: async (email, password, userData = {}) => {
    // Establecer rol por defecto desde configuración centralizada
    const defaultUserData = {
      role: DEFAULT_ROLE,
      ...userData
    }
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: defaultUserData
      }
    })
    return { data, error }
  },

  // Cerrar sesión
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Recuperar contraseña
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
} 