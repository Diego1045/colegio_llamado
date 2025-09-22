<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Cargando perfil...</p>
        </div>

        <div v-else>
          <!-- Información del perfil -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  v-model="perfil.nombre"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!editando"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  v-model="perfil.apellido"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!editando"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  v-model="perfil.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end space-x-4">
            <button
              v-if="!editando"
              @click="editando = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Editar Perfil
            </button>
            <template v-else>
              <button
                @click="cancelarEdicion"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancelar
              </button>
              <button
                @click="guardarPerfil"
                :disabled="guardando"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Sección de cambio de contraseña -->
      <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Cambiar Contraseña</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <input
              v-model="password.nueva"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input
              v-model="password.confirmar"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
          <button
            @click="cambiarPassword"
            :disabled="loadingPassword || !password.nueva || password.nueva !== password.confirmar"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50"
          >
            {{ loadingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/authService.js'

const authStore = useAuthStore()

const loading = ref(false)
const editando = ref(false)
const guardando = ref(false)
const loadingPassword = ref(false)

const perfil = ref({
  nombre: '',
  apellido: '',
  email: ''
})

const perfilOriginal = ref({})

const password = ref({
  nueva: '',
  confirmar: ''
})

const cargarPerfil = async () => {
  try {
    loading.value = true
    
    // Usar datos del usuario autenticado desde Laravel
    if (authStore.user) {
      perfil.value = {
        nombre: authStore.user.nombre || '',
        apellido: authStore.user.apellido || '',
        email: authStore.user.email || ''
      }
      perfilOriginal.value = { ...perfil.value }
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error)
  } finally {
    loading.value = false
  }
}

const guardarPerfil = async () => {
  try {
    guardando.value = true
    // TODO: Implementar actualización de perfil cuando Laravel tenga el endpoint
    console.log('Guardando perfil:', perfil.value)
    
    // Por ahora solo simular el guardado
    perfilOriginal.value = { ...perfil.value }
    editando.value = false
    
    // Mostrar mensaje de éxito
    alert('Perfil actualizado correctamente')
  } catch (error) {
    console.error('Error al guardar perfil:', error)
    alert('Error al guardar el perfil')
  } finally {
    guardando.value = false
  }
}

const cancelarEdicion = () => {
  perfil.value = { ...perfilOriginal.value }
  editando.value = false
}

const cambiarPassword = async () => {
  try {
    loadingPassword.value = true
    
    // TODO: Implementar cambio de contraseña cuando Laravel tenga el endpoint
    console.log('Cambiando contraseña')
    
    // Por ahora solo simular
    password.value = { nueva: '', confirmar: '' }
    alert('Contraseña cambiada correctamente')
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    alert('Error al cambiar la contraseña')
  } finally {
    loadingPassword.value = false
  }
}

onMounted(() => {
  cargarPerfil()
})
</script>