<template>
  <div class="space-y-4">
    <!-- Filtros -->
    <FiltrosHistorial @filtros-aplicados="aplicarFiltros" />

    <!-- Tabla de llamadas -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estudiante
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fecha
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
          <tr v-for="llamada in llamadasFiltradas" :key="llamada.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ llamada.estudiante_nombre }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    Grado {{ llamada.estudiante_grado }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatFecha(llamada.fecha) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="getEstadoClass(llamada.estado)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ llamada.estado }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="verDetalles(llamada)"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                aria-label="Ver detalles"
              >
                <i class="fas fa-eye" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Mostrando {{ llamadasFiltradas.length }} de {{ llamadas.length }} registros
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
          :disabled="paginaActual * registrosPorPagina >= llamadasFiltradas.length"
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
import FiltrosHistorial from './FiltrosHistorial.vue'

const llamadas = ref([])
const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  estado: '',
  grado: '',
  estudiante: ''
})
const paginaActual = ref(1)
const registrosPorPagina = 10

onMounted(async () => {
  await cargarLlamadas()
})

const cargarLlamadas = async () => {
  try {
    const { data, error } = await supabase
      .from('registros_salida')
      .select(`
        *,
        estudiantes (
          nombre,
          grado
        )
      `)
      .order('fecha', { ascending: false })

    if (error) throw error
    llamadas.value = data.map(llamada => ({
      ...llamada,
      estudiante_nombre: llamada.estudiantes.nombre,
      estudiante_grado: llamada.estudiantes.grado
    }))
  } catch (error) {
    console.error('Error al cargar llamadas:', error)
  }
}

const aplicarFiltros = (nuevosFiltros) => {
  filtros.value = nuevosFiltros
  paginaActual.value = 1
}

const llamadasFiltradas = computed(() => {
  return llamadas.value.filter(llamada => {
    // Filtro por fecha
    if (filtros.value.fechaInicio && new Date(llamada.fecha) < new Date(filtros.value.fechaInicio)) {
      return false
    }
    if (filtros.value.fechaFin && new Date(llamada.fecha) > new Date(filtros.value.fechaFin)) {
      return false
    }

    // Filtro por estado
    if (filtros.value.estado && llamada.estado !== filtros.value.estado) {
      return false
    }

    // Filtro por grado
    if (filtros.value.grado && llamada.estudiante_grado !== filtros.value.grado) {
      return false
    }

    // Filtro por estudiante
    if (filtros.value.estudiante) {
      const busqueda = filtros.value.estudiante.toLowerCase()
      const nombre = llamada.estudiante_nombre.toLowerCase()
      if (!nombre.includes(busqueda)) {
        return false
      }
    }

    return true
  })
})

const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
  }
}

const paginaSiguiente = () => {
  if (paginaActual.value * registrosPorPagina < llamadasFiltradas.value.length) {
    paginaActual.value++
  }
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString()
}

const getEstadoClass = (estado) => {
  const clases = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    aprobado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rechazado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return clases[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const verDetalles = (llamada) => {
  // Implementar lógica para ver detalles
  console.log('Ver detalles:', llamada)
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