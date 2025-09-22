<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Mis Estudiantes</h1>
      <button
        v-if="authStore.isAdmin"
        @click="mostrarFormulario = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
      >
        Agregar Estudiante
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Cargando estudiantes...</p>
    </div>

    <!-- Lista de estudiantes -->
    <div v-else-if="estudiantes.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="estudiante in estudiantes"
        :key="estudiante.id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ estudiante.nombre_completo }}</h3>
            <p class="text-gray-600">{{ estudiante.grado_seccion }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editarEstudiante(estudiante)"
              class="text-blue-600 hover:text-blue-800"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="eliminarEstudiante(estudiante.id)"
              class="text-red-600 hover:text-red-800"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <!-- Padres asociados -->
        <div v-if="estudiante.padres && estudiante.padres.length > 0" class="mt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Padres:</p>
          <div class="space-y-1">
            <div
              v-for="padre in estudiante.padres"
              :key="padre.id"
              class="text-sm text-gray-600"
            >
              {{ padre.nombre_completo }} ({{ padre.email }})
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin estudiantes -->
    <div v-else class="text-center py-12">
      <i class="fas fa-user-graduate text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No hay estudiantes registrados</h3>
      <p class="text-gray-500">Los estudiantes aparecerán aquí una vez que sean agregados.</p>
    </div>

    <!-- Modal de formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-bold mb-4">
          {{ estudianteEditando ? 'Editar Estudiante' : 'Nuevo Estudiante' }}
        </h2>
        
        <form @submit.prevent="guardarEstudiante" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="formEstudiante.nombre"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input
              v-model="formEstudiante.apellido"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grado</label>
            <input
              v-model="formEstudiante.grado"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sección</label>
            <input
              v-model="formEstudiante.seccion"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="cerrarFormulario"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardando"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { estudiantesService } from '../services/estudiantesService.js'

const authStore = useAuthStore()

const loading = ref(false)
const guardando = ref(false)
const estudiantes = ref([])
const mostrarFormulario = ref(false)
const estudianteEditando = ref(null)

const formEstudiante = ref({
  nombre: '',
  apellido: '',
  grado: '',
  seccion: ''
})

const cargarEstudiantes = async () => {
  try {
    loading.value = true
    const data = await estudiantesService.getAll()
    estudiantes.value = data
  } catch (error) {
    console.error('Error al cargar estudiantes:', error)
    alert('Error al cargar los estudiantes')
  } finally {
    loading.value = false
  }
}

const guardarEstudiante = async () => {
  try {
    guardando.value = true
    
    if (estudianteEditando.value) {
      await estudiantesService.update(estudianteEditando.value.id, formEstudiante.value)
    } else {
      await estudiantesService.create(formEstudiante.value)
    }
    
    await cargarEstudiantes()
    cerrarFormulario()
  } catch (error) {
    console.error('Error al guardar estudiante:', error)
    alert('Error al guardar el estudiante')
  } finally {
    guardando.value = false
  }
}

const editarEstudiante = (estudiante) => {
  estudianteEditando.value = estudiante
  formEstudiante.value = {
    nombre: estudiante.nombre,
    apellido: estudiante.apellido,
    grado: estudiante.grado,
    seccion: estudiante.seccion
  }
  mostrarFormulario.value = true
}

const eliminarEstudiante = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
    try {
      await estudiantesService.delete(id)
      await cargarEstudiantes()
    } catch (error) {
      console.error('Error al eliminar estudiante:', error)
      alert('Error al eliminar el estudiante')
    }
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

onMounted(() => {
  cargarEstudiantes()
})
</script>