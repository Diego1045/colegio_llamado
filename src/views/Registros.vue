<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <i class="fas fa-history text-3xl"></i>
            <h1 class="text-2xl font-bold">Historial de Llamadas</h1>
          </div>
          <router-link to="/dashboard" class="text-white hover:text-blue-200 transition">
            <i class="fas fa-arrow-left mr-2"></i>Volver al Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Filtros -->
      <section class="mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estudiante</label>
              <select v-model="filtros.estudiante_id" @change="filtrarRegistros"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="">Todos</option>
                <option v-for="estudiante in estudiantes" :key="estudiante.id" :value="estudiante.id">
                  {{ estudiante.nombre }} {{ estudiante.apellido }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select v-model="filtros.estado" @change="filtrarRegistros"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
              <input type="date" v-model="filtros.fecha" @change="filtrarRegistros"
                     class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla de Registros -->
      <section>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estudiante</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha y Hora</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ubicación</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="registro in registros" :key="registro.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ registro.estudiante_nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(registro.fecha_hora) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(registro.estado)">
                    {{ registro.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <a v-if="registro.ubicacion_lat && registro.ubicacion_lng"
                     :href="`https://www.google.com/maps?q=${registro.ubicacion_lat},${registro.ubicacion_lng}`"
                     target="_blank"
                     class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Ver en mapa
                  </a>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { registroSalidaService } from '../services/registroSalidaService'
import { estudiantesService } from '../services/estudiantesService'

const authStore = useAuthStore()
const registros = ref([])
const estudiantes = ref([])
const filtros = ref({
  estudiante_id: '',
  estado: '',
  fecha: ''
})

onMounted(async () => {
  await cargarEstudiantes()
  await cargarRegistros()
})

const cargarEstudiantes = async () => {
  try {
    const { data, error } = await supabase
      .from('padres_estudiantes')
      .select(`
        estudiantes (
          id,
          nombre,
          apellido
        )
      `)
      .eq('padre_id', authStore.user.id)

    if (error) throw error
    estudiantes.value = data.map(item => item.estudiantes)
  } catch (error) {
    console.error('Error al cargar estudiantes:', error)
  }
}

const cargarRegistros = async () => {
  try {
    let query = supabase
      .from('registros_salida')
      .select(`
        id,
        fecha_hora,
        estado,
        ubicacion_lat,
        ubicacion_lng,
        estudiantes (
          nombre,
          apellido
        )
      `)
      .eq('padre_id', authStore.user.id)
      .order('fecha_hora', { ascending: false })

    if (filtros.value.estudiante_id) {
      query = query.eq('estudiante_id', filtros.value.estudiante_id)
    }
    if (filtros.value.estado) {
      query = query.eq('estado', filtros.value.estado)
    }
    if (filtros.value.fecha) {
      const fechaInicio = new Date(filtros.value.fecha)
      fechaInicio.setHours(0, 0, 0, 0)
      const fechaFin = new Date(filtros.value.fecha)
      fechaFin.setHours(23, 59, 59, 999)
      query = query.gte('fecha_hora', fechaInicio.toISOString())
      query = query.lte('fecha_hora', fechaFin.toISOString())
    }

    const { data, error } = await query

    if (error) throw error
    registros.value = data.map(registro => ({
      ...registro,
      estudiante_nombre: `${registro.estudiantes.nombre} ${registro.estudiantes.apellido}`
    }))
  } catch (error) {
    console.error('Error al cargar registros:', error)
  }
}

const filtrarRegistros = () => {
  cargarRegistros()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    pendiente: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    confirmado: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completado: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return classes[status] || classes.pendiente
}
</script> 