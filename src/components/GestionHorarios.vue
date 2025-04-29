<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Gestión de Horarios</h2>

    <!-- Configuración de horarios -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Horario Preescolar -->
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-3">Preescolar</h3>
        <div class="space-y-4">
          <div class="form-group">
            <label for="horaSalidaPreescolar" class="form-label">Hora de Salida</label>
            <input
              type="time"
              id="horaSalidaPreescolar"
              v-model="horarios.preescolar.horaSalida"
              class="form-input"
              @change="actualizarHorario('preescolar')"
            >
          </div>
          <div class="form-group">
            <label for="tiempoRecogidaPreescolar" class="form-label">Tiempo de Recogida</label>
            <div class="flex items-center">
              <input
                type="number"
                id="tiempoRecogidaPreescolar"
                v-model="horarios.preescolar.tiempoRecogida"
                class="form-input w-20"
                min="1"
                max="120"
                @change="actualizarHorario('preescolar')"
              >
              <span class="ml-2 text-gray-600 dark:text-gray-300">minutos</span>
            </div>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            <p>Hora límite de recogida: {{ calcularHoraLimite('preescolar') }}</p>
          </div>
        </div>
      </div>

      <!-- Horario Primaria y Secundaria -->
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-3">Primaria y Secundaria</h3>
        <div class="space-y-4">
          <div class="form-group">
            <label for="horaSalidaPrimaria" class="form-label">Hora de Salida</label>
            <input
              type="time"
              id="horaSalidaPrimaria"
              v-model="horarios.primaria.horaSalida"
              class="form-input"
              @change="actualizarHorario('primaria')"
            >
          </div>
          <div class="form-group">
            <label for="tiempoRecogidaPrimaria" class="form-label">Tiempo de Recogida</label>
            <div class="flex items-center">
              <input
                type="number"
                id="tiempoRecogidaPrimaria"
                v-model="horarios.primaria.tiempoRecogida"
                class="form-input w-20"
                min="1"
                max="120"
                @change="actualizarHorario('primaria')"
              >
              <span class="ml-2 text-gray-600 dark:text-gray-300">minutos</span>
            </div>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            <p>Hora límite de recogida: {{ calcularHoraLimite('primaria') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de resumen -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nivel
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Hora de Salida
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tiempo de Recogida
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Hora Límite
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              Preescolar
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ horarios.preescolar.horaSalida }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ horarios.preescolar.tiempoRecogida }} minutos
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ calcularHoraLimite('preescolar') }}
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              Primaria y Secundaria
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ horarios.primaria.horaSalida }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ horarios.primaria.tiempoRecogida }} minutos
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ calcularHoraLimite('primaria') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const horarios = ref({
  preescolar: {
    horaSalida: '12:00',
    tiempoRecogida: 40
  },
  primaria: {
    horaSalida: '12:20',
    tiempoRecogida: 60
  }
})

onMounted(async () => {
  await cargarHorarios()
})

const cargarHorarios = async () => {
  try {
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')
      .eq('clave', 'horarios')

    if (error) throw error

    if (data && data.length > 0) {
      horarios.value = data[0].valor
    } else {
      // Si no existe la configuración, la creamos con los valores por defecto
      await guardarHorarios()
    }
  } catch (error) {
    console.error('Error al cargar horarios:', error)
  }
}

const guardarHorarios = async () => {
  try {
    const { error } = await supabase
      .from('configuracion')
      .upsert({
        clave: 'horarios',
        valor: horarios.value,
        descripcion: 'Configuración de horarios de salida y recogida'
      })

    if (error) throw error
  } catch (error) {
    console.error('Error al guardar horarios:', error)
  }
}

const actualizarHorario = async (nivel) => {
  await guardarHorarios()
}

const calcularHoraLimite = (nivel) => {
  const horaSalida = horarios.value[nivel].horaSalida
  const tiempoRecogida = horarios.value[nivel].tiempoRecogida

  const [horas, minutos] = horaSalida.split(':').map(Number)
  const fecha = new Date()
  fecha.setHours(horas, minutos + tiempoRecogida, 0)

  return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
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
.dark .bg-gray-50 {
  background-color: #1a1a1a;
}
</style> 