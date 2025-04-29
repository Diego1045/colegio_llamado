<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <i class="fas fa-user-graduate text-3xl"></i>
            <h1 class="text-2xl font-bold">Mis Hijos</h1>
          </div>
          <router-link to="/dashboard" class="text-white hover:text-blue-200 transition">
            <i class="fas fa-arrow-left mr-2"></i>Volver al Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Lista de Estudiantes -->
      <section class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Lista de Estudiantes</h2>
          <button @click="mostrarFormulario = true"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
            <i class="fas fa-plus mr-2"></i>Agregar Estudiante
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="estudiante in estudiantes" :key="estudiante.id"
               class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-blue-600 dark:text-blue-300"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  {{ estudiante.nombre }} {{ estudiante.apellido }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Grado: {{ estudiante.grado }} - Sección: {{ estudiante.seccion }}
                </p>
              </div>
            </div>
            <div class="flex justify-end space-x-2">
              <button @click="editarEstudiante(estudiante)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="eliminarEstudiante(estudiante)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Formulario de Estudiante -->
      <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {{ estudianteEditando ? 'Editar Estudiante' : 'Agregar Estudiante' }}
          </h3>
          <form @submit.prevent="guardarEstudiante" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input type="text" v-model="formEstudiante.nombre" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
              <input type="text" v-model="formEstudiante.apellido" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grado</label>
              <input type="text" v-model="formEstudiante.grado" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sección</label>
              <input type="text" v-model="formEstudiante.seccion" required
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div class="flex justify-end space-x-2 pt-4">
              <button type="button" @click="cerrarFormulario"
                      class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                Cancelar
              </button>
              <button type="submit" :disabled="loading"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
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
const estudiantes = ref([])
const mostrarFormulario = ref(false)
const estudianteEditando = ref(null)
const formEstudiante = ref({
  nombre: '',
  apellido: '',
  grado: '',
  seccion: ''
})

onMounted(async () => {
  await cargarEstudiantes()
})

const cargarEstudiantes = async () => {
  try {
    const { data, error } = await supabase
      .from('padres_estudiantes')
      .select(`
        estudiantes (
          id,
          nombre,
          apellido,
          grado,
          seccion
        )
      `)
      .eq('padre_id', authStore.user.id)

    if (error) throw error
    estudiantes.value = data.map(item => item.estudiantes)
  } catch (error) {
    console.error('Error al cargar estudiantes:', error)
  }
}

const editarEstudiante = (estudiante) => {
  estudianteEditando.value = estudiante
  formEstudiante.value = { ...estudiante }
  mostrarFormulario.value = true
}

const eliminarEstudiante = async (estudiante) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) return

  try {
    const { error } = await supabase
      .from('padres_estudiantes')
      .delete()
      .eq('padre_id', authStore.user.id)
      .eq('estudiante_id', estudiante.id)

    if (error) throw error
    await cargarEstudiantes()
  } catch (error) {
    console.error('Error al eliminar estudiante:', error)
    alert('Error al eliminar el estudiante')
  }
}

const guardarEstudiante = async () => {
  try {
    loading.value = true
    let estudianteId

    if (estudianteEditando.value) {
      const { error } = await supabase
        .from('estudiantes')
        .update({
          nombre: formEstudiante.value.nombre,
          apellido: formEstudiante.value.apellido,
          grado: formEstudiante.value.grado,
          seccion: formEstudiante.value.seccion,
          updated_at: new Date().toISOString()
        })
        .eq('id', estudianteEditando.value.id)

      if (error) throw error
      estudianteId = estudianteEditando.value.id
    } else {
      const { data, error } = await supabase
        .from('estudiantes')
        .insert([
          {
            nombre: formEstudiante.value.nombre,
            apellido: formEstudiante.value.apellido,
            grado: formEstudiante.value.grado,
            seccion: formEstudiante.value.seccion
          }
        ])
        .select()

      if (error) throw error
      estudianteId = data[0].id

      // Crear relación padre-estudiante
      const { error: relacionError } = await supabase
        .from('padres_estudiantes')
        .insert([
          {
            padre_id: authStore.user.id,
            estudiante_id: estudianteId
          }
        ])

      if (relacionError) throw relacionError
    }

    await cargarEstudiantes()
    cerrarFormulario()
  } catch (error) {
    console.error('Error al guardar estudiante:', error)
    alert('Error al guardar el estudiante')
  } finally {
    loading.value = false
  }
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  estudianteEditando.value = null
  formEstudiante.value = {
    nombre: '',
    apellido: '',
    grado: '',
    seccion: ''
  }
}
</script> 