<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <i class="fas fa-user text-3xl"></i>
            <h1 class="text-2xl font-bold">Mi Perfil</h1>
          </div>
          <router-link to="/dashboard" class="text-white hover:text-blue-200 transition">
            <i class="fas fa-arrow-left mr-2"></i>Volver al Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- Información Personal -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Información Personal</h2>
          <form @submit.prevent="actualizarPerfil" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input type="text" v-model="perfil.nombre" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
              <input type="text" v-model="perfil.apellido" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
              <input type="email" v-model="perfil.email" disabled
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-gray-400">
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
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
              <input type="password" v-model="password.nueva" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
              <input type="password" v-model="password.confirmacion" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
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
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', authStore.user.id)
      .single()

    if (error) throw error
    perfil.value = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: authStore.user.email
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error)
  }
}

const actualizarPerfil = async () => {
  try {
    loading.value = true
    const { error } = await supabase
      .from('usuarios')
      .update({
        nombre: perfil.value.nombre,
        apellido: perfil.value.apellido,
        updated_at: new Date().toISOString()
      })
      .eq('id', authStore.user.id)

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