<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Búsqueda de Estudiantes</h2>
      <div class="relative w-full md:w-64">
        <input
          type="text"
          v-model="busqueda"
          @input="buscarEstudiantes"
          placeholder="Buscar por nombre, grado o documento..."
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          aria-label="Buscar estudiantes"
        >
        <button
          @click="resetearBusqueda"
          class="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Resetear búsqueda"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Filtros avanzados -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="form-group">
        <label for="grado" class="form-label">Grado</label>
        <select
          id="grado"
          v-model="filtros.grado"
          @change="aplicarFiltros"
          class="form-input"
        >
          <option value="">Todos los grados</option>
          <option v-for="grado in grados" :key="grado" :value="grado">
            Grado {{ grado }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="estado" class="form-label">Estado</label>
        <select
          id="estado"
          v-model="filtros.estado"
          @change="aplicarFiltros"
          class="form-input"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <div class="form-group">
        <label for="orden" class="form-label">Ordenar por</label>
        <select
          id="orden"
          v-model="filtros.orden"
          @change="aplicarFiltros"
          class="form-input"
        >
          <option value="nombre">Nombre (A-Z)</option>
          <option value="nombre_desc">Nombre (Z-A)</option>
          <option value="grado">Grado (asc)</option>
          <option value="grado_desc">Grado (desc)</option>
        </select>
      </div>
    </div>

    <!-- Resultados -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nombre
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Grado
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Documento
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="estudiante in estudiantesFiltrados" :key="estudiante.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ estudiante.nombre }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              Grado {{ estudiante.grado }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ estudiante.documento }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getEstadoClass(estudiante.estado)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ estudiante.estado }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="verDetalles(estudiante)"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                aria-label="Ver detalles"
              >
                <i class="fas fa-eye" aria-hidden="true"></i>
              </button>
              <button
                @click="editarEstudiante(estudiante)"
                class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                aria-label="Editar estudiante"
              >
                <i class="fas fa-edit" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Mostrando {{ estudiantesFiltrados.length }} de {{ estudiantes.length }} estudiantes
      </div>
      <div class="flex space-x-2">
        <button
          @click="paginaAnterior"
          :disabled="paginaActual === 1"
          class="btn btn-secondary"
          aria-label="Página anterior"
        >
          <i class="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button
          @click="paginaSiguiente"
          :disabled="paginaActual * registrosPorPagina >= estudiantesFiltrados.length"
          class="btn btn-secondary"
          aria-label="Página siguiente"
        >
          <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const estudiantes = ref([])
const busqueda = ref('')
const filtros = ref({
  grado: '',
  estado: '',
  orden: 'nombre'
})
const paginaActual = ref(1)
const registrosPorPagina = 10
const grados = ref([])

onMounted(async () => {
  await cargarEstudiantes()
  await cargarGrados()
})

const cargarEstudiantes = async () => {
  try {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) throw error
    estudiantes.value = data
  } catch (error) {
    console.error('Error al cargar estudiantes:', error)
  }
}

const cargarGrados = async () => {
  try {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('grado')
      .order('grado', { ascending: true })

    if (error) throw error
    grados.value = [...new Set(data.map(e => e.grado))]
  } catch (error) {
    console.error('Error al cargar grados:', error)
  }
}

const buscarEstudiantes = () => {
  paginaActual.value = 1
}

const resetearBusqueda = () => {
  busqueda.value = ''
  buscarEstudiantes()
}

const aplicarFiltros = () => {
  paginaActual.value = 1
}

const estudiantesFiltrados = computed(() => {
  let resultado = estudiantes.value

  // Aplicar búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase()
    resultado = resultado.filter(estudiante => 
      estudiante.nombre.toLowerCase().includes(termino) ||
      estudiante.grado.toString().includes(termino) ||
      estudiante.documento.toLowerCase().includes(termino)
    )
  }

  // Aplicar filtros
  if (filtros.value.grado) {
    resultado = resultado.filter(estudiante => estudiante.grado === filtros.value.grado)
  }
  if (filtros.value.estado) {
    resultado = resultado.filter(estudiante => estudiante.estado === filtros.value.estado)
  }

  // Aplicar ordenamiento
  resultado.sort((a, b) => {
    switch (filtros.value.orden) {
      case 'nombre':
        return a.nombre.localeCompare(b.nombre)
      case 'nombre_desc':
        return b.nombre.localeCompare(a.nombre)
      case 'grado':
        return a.grado - b.grado
      case 'grado_desc':
        return b.grado - a.grado
      default:
        return 0
    }
  })

  return resultado
})

const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
  }
}

const paginaSiguiente = () => {
  if (paginaActual.value * registrosPorPagina < estudiantesFiltrados.value.length) {
    paginaActual.value++
  }
}

const getEstadoClass = (estado) => {
  return estado === 'activo'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

const verDetalles = (estudiante) => {
  // Implementar lógica para ver detalles
  console.log('Ver detalles:', estudiante)
}

const editarEstudiante = (estudiante) => {
  // Implementar lógica para editar estudiante
  console.log('Editar estudiante:', estudiante)
}
</script>

<style scoped>
/* Estilos específicos para el modo oscuro */
.dark .bg-white {
  background-color: #2d2d2d;
}
.dark .text-gray-900 {
  color: #FFFFFF;
}
.dark .divide-gray-200 {
  border-color: #404040;
}
</style> 