<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 mt-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center mb-6">
          <i class="fas fa-user text-3xl text-blue-600 mr-3"></i>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Mi Perfil</h1>
        </div>
        
        <!-- Información Personal -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Información Personal</h2>
          <form @submit.prevent="actualizarPerfil" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input type="text" v-model="perfil.nombre" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
              <input type="text" v-model="perfil.apellido" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
              <input type="email" v-model="perfil.email" disabled
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
            </div>
            <div class="pt-4">
              <button type="submit" :disabled="loading"
                      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </section>

        <!-- Cambiar Contraseña -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Cambiar Contraseña</h2>
          <form @submit.prevent="cambiarContraseña" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Actual</label>
              <input type="password" v-model="password.actual" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
              <input type="password" v-model="password.nueva" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
              <input type="password" v-model="password.confirmacion" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
            </div>
            <div class="pt-4">
              <button type="submit" :disabled="loadingPassword"
                      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                {{ loadingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

const authStore = useAuthStore()
const loading = ref(false)
const loadingPassword = ref(false)
const perfil = ref({
  nombre: '',
  apellido: '',
  email: ''
})
const password = ref({
  actual: '',
  nueva: '',
  confirmacion: ''
})

onMounted(async () => {
  await cargarPerfil()
})

const cargarPerfil = async () => {
  try {
    if (!authStore.user || !authStore.user.id) {
      console.error('Usuario no autenticado o sin ID')
      // Intentar inicializar el store si el usuario no está disponible
      await authStore.initialize()
      
      // Si después de inicializar sigue sin haber usuario, salir
      if (!authStore.user || !authStore.user.id) {
        console.error('No se pudo obtener el usuario después de la inicialización')
        return
      }
    }
    
    // Mostrar información del usuario para depuración
    console.log('Información del usuario autenticado:', authStore.user)
    
    // Pre-establecer el correo electrónico desde el usuario autenticado
    perfil.value.email = authStore.user.email || ''
    
    // Intentar obtener la lista de todas las tablas disponibles
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
    
    if (!tablesError) {
      console.log('Tablas disponibles:', tables)
    }
    
    // Intentar obtener perfil de la tabla profiles (común en Supabase)
    let { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authStore.user.id)
    
    if (!profileError && profileData && profileData.length > 0) {
      console.log('Datos encontrados en tabla profiles:', profileData)
      perfil.value = {
        nombre: profileData[0].nombre || profileData[0].name || profileData[0].first_name || '',
        apellido: profileData[0].apellido || profileData[0].lastname || profileData[0].last_name || '',
        email: authStore.user.email || ''
      }
      return
    }
    
    // Intentar con tabla users
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    console.log('Consulta a tabla users - data:', data, 'error:', error)
    
    if (!error && data && data.length > 0) {
      // Buscar un registro que coincida con el usuario
      const userProfile = data.find(item => item.id === authStore.user.id || 
                                          item.auth_id === authStore.user.id || 
                                          item.user_id === authStore.user.id || 
                                          item.email === authStore.user.email)
      
      if (userProfile) {
        console.log('Perfil encontrado en users por coincidencia:', userProfile)
        perfil.value = {
          nombre: userProfile.nombre || userProfile.name || userProfile.first_name || '',
          apellido: userProfile.apellido || userProfile.lastname || userProfile.last_name || '',
          email: authStore.user.email || ''
        }
        return
      } else {
        console.log('No se encontró coincidencia en la tabla users para el usuario:', authStore.user.id)
      }
    }
    
    // Si llegamos aquí, no se encontró el perfil
    console.log('No se encontró perfil en ninguna tabla. Usando email del usuario autenticado.')
    perfil.value = {
      nombre: '',
      apellido: '',
      email: authStore.user.email || ''
    }
    
  } catch (error) {
    console.error('Error al cargar perfil:', error)
    alert('Error al cargar los datos del perfil. Por favor, intente nuevamente.')
  }
}

const actualizarPerfil = async () => {
  try {
    loading.value = true
    
    // Determinar en qué tabla guardar los datos
    // Primero intentemos con profiles
    let { error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authStore.user.id)
    
    if (!profilesError) {
      // La tabla profiles existe y podemos consultarla
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: authStore.user.id,
          nombre: perfil.value.nombre,
          apellido: perfil.value.apellido,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      alert('Perfil actualizado exitosamente')
      return
    }
    
    // Si no existe profiles, intentemos con users
    const { error } = await supabase
      .from('users')
      .upsert({
        id: authStore.user.id,
        nombre: perfil.value.nombre,
        apellido: perfil.value.apellido,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
    alert('Perfil actualizado exitosamente')
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    alert('Error al actualizar el perfil')
  } finally {
    loading.value = false
  }
}

const cambiarContraseña = async () => {
  if (password.value.nueva !== password.value.confirmacion) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    loadingPassword.value = true
    const { error } = await supabase.auth.updateUser({
      password: password.value.nueva
    })

    if (error) throw error
    alert('Contraseña actualizada exitosamente')
    password.value = {
      actual: '',
      nueva: '',
      confirmacion: ''
    }
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    alert('Error al cambiar la contraseña')
  } finally {
    loadingPassword.value = false
  }
}
</script> 