<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Anuncios por Micrófono</h3>
    
    <!-- Opción de llamado automático -->
    <div class="mb-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
      <div class="flex items-center">
        <input 
          id="llamadoAutomatico" 
          v-model="llamadoAutomatico" 
          type="checkbox" 
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
        />
        <label for="llamadoAutomatico" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Activar llamado automático de estudiantes
        </label>
      </div>
      <span 
        v-if="llamadoAutomatico" 
        class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
      >
        <span class="mr-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        Activo
      </span>
    </div>
    
    <!-- Lista de estudiantes pendientes para llamar -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">Cargando...</p>
    </div>
    <div v-else-if="estudiantesPendientes.length > 0" class="space-y-4 mb-6">
      <div class="flex justify-between items-center">
        <h4 class="font-medium text-gray-700 dark:text-gray-300">Estudiantes pendientes de llamado</h4>
        <span v-if="actualizandoSilenciosamente" class="text-xs text-blue-500 dark:text-blue-400 flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Actualizando...
        </span>
      </div>
      <div 
        v-for="estudiante in estudiantesPendientes" 
        :key="estudiante.id"
        class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center"
        :class="{'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20': estudianteLlamandoId === estudiante.id}"
      >
        <div>
          <h4 class="font-semibold text-gray-800 dark:text-white">
            {{ estudiante.nombre }} {{ estudiante.apellido }}
            <span v-if="estudianteLlamandoId === estudiante.id" class="ml-2 inline-flex items-center text-blue-600 dark:text-blue-400 text-sm animate-pulse">
              <i class="fas fa-volume-up mr-1"></i> Llamando...
            </span>
          </h4>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Grado {{ estudiante.grado }} - Sección {{ estudiante.seccion }}
            <span class="text-xs ml-2 text-blue-600">Solicitado hace {{ formatTimeDifference(estudiante.fecha_hora) }}</span>
          </p>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="anunciarEstudiante(estudiante)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
            :disabled="estaAnunciando"
            :class="{'opacity-50 cursor-not-allowed': estaAnunciando}"
          >
            <i class="fas fa-microphone mr-1"></i> Anunciar
          </button>
          <button 
            @click="marcarComoCompletado(estudiante.registro_id)"
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
            :disabled="estudianteLlamandoId === estudiante.id"
            :class="{'opacity-50 cursor-not-allowed': estudianteLlamandoId === estudiante.id}"
          >
            <i class="fas fa-check mr-1"></i> Completado
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8 mb-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <i class="fas fa-bell-slash text-4xl mb-2"></i>
      <p>No hay estudiantes pendientes para llamar.</p>
    </div>

    <!-- Anuncio manual -->
    <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">Anuncio manual</h4>
      <div class="space-y-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input 
              v-model="anuncioManual.nombre" 
              type="text" 
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Nombre del estudiante"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
            <input 
              v-model="anuncioManual.apellido" 
              type="text" 
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Apellido del estudiante"
            />
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grado</label>
            <input 
              v-model="anuncioManual.grado" 
              type="text" 
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Grado"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sección</label>
            <input 
              v-model="anuncioManual.seccion" 
              type="text" 
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Sección"
            />
          </div>
        </div>
        <div class="pt-2">
          <button 
            @click="anunciarManual"
            :disabled="estaAnunciando"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            :class="{'opacity-50 cursor-not-allowed': estaAnunciando}"
          >
            <i class="fas fa-microphone mr-2"></i> 
            {{ estaAnunciando ? 'Anunciando...' : 'Realizar anuncio' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Historial de anuncios recientes -->
    <div class="mt-6">
      <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">Anuncios recientes</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="py-2 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Estudiante</th>
              <th class="py-2 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Grado/Sección</th>
              <th class="py-2 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Hora</th>
              <th class="py-2 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="anuncio in anunciosRecientes" :key="anuncio.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="py-2 px-4 text-sm text-gray-800 dark:text-white">{{ anuncio.nombre }} {{ anuncio.apellido }}</td>
              <td class="py-2 px-4 text-sm text-gray-800 dark:text-white">{{ anuncio.grado }} - {{ anuncio.seccion }}</td>
              <td class="py-2 px-4 text-sm text-gray-600 dark:text-gray-300">{{ formatTime(anuncio.fecha_hora) }}</td>
              <td class="py-2 px-4 text-sm">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium', 
                    anuncio.estado === 'completado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  ]"
                >
                  {{ anuncio.estado }}
                </span>
              </td>
            </tr>
            <tr v-if="anunciosRecientes.length === 0">
              <td colspan="4" class="py-4 text-center text-gray-500 dark:text-gray-400">No hay anuncios recientes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Notificación de éxito -->
    <div 
      v-if="showNotification"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        <span>{{ notificationMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from '../supabase'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const estudiantesPendientes = ref([])
const anunciosRecientes = ref([])
const loading = ref(false)
const actualizandoSilenciosamente = ref(false)
const estaAnunciando = ref(false)
const estudianteLlamandoId = ref(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const llamadoAutomatico = ref(false)
const anuncioManual = ref({
  nombre: '',
  apellido: '',
  grado: '',
  seccion: ''
})

// Para la síntesis de voz
let voiceSynthesis = null
let subscription = null
let intervaloActualizacion = null

onMounted(async () => {
  await cargarEstudiantesPendientes()
  await cargarAnunciosRecientes()
  
  // Inicializar la síntesis de voz
  voiceSynthesis = window.speechSynthesis
  
  // Suscribirse a cambios en tiempo real (nuevos registros de salida)
  subscription = supabase
    .channel('registros_salida')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'registros_salida' }, 
      async (payload) => {
        await cargarEstudiantesPendientes(true)
        await cargarAnunciosRecientes()
        
        // Si el llamado automático está activo, anunciar el nuevo estudiante
        if (llamadoAutomatico.value && !estaAnunciando.value && estudiantesPendientes.value.length > 0) {
          // Buscar el estudiante recién añadido (asumimos que es el primero en la lista actualizada)
          const nuevoEstudiante = estudiantesPendientes.value[0]
          anunciarEstudiante(nuevoEstudiante)
        }
      }
    )
    .subscribe()
    
  // Configurar actualización automática cada 5 segundos
  intervaloActualizacion = setInterval(async () => {
    await cargarEstudiantesPendientes(true)
    
    // Si el llamado automático está activo y no hay anuncios en curso, anunciar el próximo estudiante
    if (llamadoAutomatico.value && !estaAnunciando.value && estudiantesPendientes.value.length > 0) {
      const siguienteEstudiante = estudiantesPendientes.value[0]
      anunciarEstudiante(siguienteEstudiante)
    }
  }, 5000)
})

// Observar cambios en la lista de estudiantes pendientes para el llamado automático
watch(estudiantesPendientes, (nuevaLista, antiguaLista) => {
  // Si hay nuevos estudiantes pendientes, el llamado automático está activo y no hay anuncios en curso
  if (nuevaLista.length > 0 && llamadoAutomatico.value && !estaAnunciando.value) {
    // Si la lista estaba vacía o el primer estudiante es diferente
    if (antiguaLista.length === 0 || nuevaLista[0].id !== antiguaLista[0]?.id) {
      anunciarEstudiante(nuevaLista[0])
    }
  }
}, { deep: true })

onUnmounted(() => {
  // Limpiar suscripción
  if (subscription) {
    supabase.removeChannel(subscription)
  }
  
  // Limpiar intervalo de actualización
  if (intervaloActualizacion) {
    clearInterval(intervaloActualizacion)
  }
})

const cargarEstudiantesPendientes = async (silencioso = false) => {
  if (silencioso) {
    actualizandoSilenciosamente.value = true
  } else {
    loading.value = true
  }
  
  try {
    // Buscar registros pendientes
    const { data, error } = await supabase
      .from('registros_salida')
      .select(`
        id,
        fecha_hora,
        estudiante_id,
        estudiantes(id, nombre, apellido, grado, seccion)
      `)
      .eq('estado', 'pendiente')
      .order('fecha_hora', { ascending: true })
    
    if (error) throw error
    
    estudiantesPendientes.value = data.map(registro => ({
      registro_id: registro.id,
      id: registro.estudiantes.id,
      nombre: registro.estudiantes.nombre,
      apellido: registro.estudiantes.apellido,
      grado: registro.estudiantes.grado,
      seccion: registro.estudiantes.seccion,
      fecha_hora: registro.fecha_hora
    }))
  } catch (error) {
    console.error('Error al cargar estudiantes pendientes:', error)
  } finally {
    if (silencioso) {
      actualizandoSilenciosamente.value = false
    } else {
      loading.value = false
    }
  }
}

const cargarAnunciosRecientes = async () => {
  try {
    const { data, error } = await supabase
      .from('registros_salida')
      .select(`
        id,
        fecha_hora,
        estado,
        estudiantes(id, nombre, apellido, grado, seccion)
      `)
      .in('estado', ['anunciado', 'completado'])
      .order('fecha_hora', { ascending: false })
      .limit(10)
    
    if (error) throw error
    
    anunciosRecientes.value = data.map(registro => ({
      id: registro.id,
      nombre: registro.estudiantes.nombre,
      apellido: registro.estudiantes.apellido,
      grado: registro.estudiantes.grado,
      seccion: registro.estudiantes.seccion,
      fecha_hora: registro.fecha_hora,
      estado: registro.estado
    }))
  } catch (error) {
    console.error('Error al cargar anuncios recientes:', error)
  }
}

const anunciarEstudiante = (estudiante) => {
  estaAnunciando.value = true
  estudianteLlamandoId.value = estudiante.id
  
  let textoAnuncio = `${estudiante.nombre} ${estudiante.apellido}`;
  if (estudiante.grado) {
    textoAnuncio += ` de ${estudiante.grado}`;
  }
  if (estudiante.seccion) {
    textoAnuncio += ` sección ${estudiante.seccion}`;
  }
  //dos veces separado por un punto
  textoAnuncio += `. ${textoAnuncio}`;

  
  hablarPorVoz(textoAnuncio, () => {
    actualizarEstadoRegistro(estudiante.registro_id, 'anunciado')
    estaAnunciando.value = false
    estudianteLlamandoId.value = null
  })
}

const anunciarManual = () => {
  if (!anuncioManual.value.nombre || !anuncioManual.value.apellido) {
    mostrarNotificacion('Por favor ingresa al menos el nombre y apellido del estudiante', 'error')
    return
  }
  
  estaAnunciando.value = true
  
  const textoAnuncio = `Atención. Se solicita la presencia de ${anuncioManual.value.nombre} ${anuncioManual.value.apellido}${
    anuncioManual.value.grado ? ` de ${anuncioManual.value.grado}` : ''
  }${anuncioManual.value.seccion ? ` sección ${anuncioManual.value.seccion}` : ''} en la puerta principal.`
  
  hablarPorVoz(textoAnuncio, () => {
    estaAnunciando.value = false
    
    // Registrar el anuncio manual en la base de datos
    registrarAnuncioManual()
    
    // Resetear el formulario
    anuncioManual.value = {
      nombre: '',
      apellido: '',
      grado: '',
      seccion: ''
    }
  })
}

const hablarPorVoz = (texto, callback) => {
  if (!voiceSynthesis) {
    console.error('La síntesis de voz no está disponible en este navegador')
    estaAnunciando.value = false
    mostrarNotificacion('La síntesis de voz no está disponible en este navegador', 'error')
    return
  }
  
  // Detener cualquier anuncio en curso
  voiceSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(texto)
  
  // Configurar la voz (idealmente una voz en español)
  const voices = voiceSynthesis.getVoices()
  const spanishVoice = voices.find(voice => voice.lang.includes('es'))
  if (spanishVoice) {
    utterance.voice = spanishVoice
  }
  
  utterance.rate = 1 // Un poco más lento para mayor claridad
  utterance.pitch = 1
  utterance.volume = 1
  
  utterance.onend = () => {
    if (callback) callback()
  }
  
  utterance.onerror = (error) => {
    console.error('Error en la síntesis de voz:', error)
    estaAnunciando.value = false
    if (callback) callback()
  }
  
  voiceSynthesis.speak(utterance)
}

const actualizarEstadoRegistro = async (registroId, estado) => {
  try {
    const { error } = await supabase
      .from('registros_salida')
      .update({ estado })
      .eq('id', registroId)
    
    if (error) throw error
    
    // Recargar datos
    await cargarEstudiantesPendientes()
    await cargarAnunciosRecientes()
    
    mostrarNotificacion('Anuncio realizado con éxito')
  } catch (error) {
    console.error('Error al actualizar estado del registro:', error)
  }
}

const registrarAnuncioManual = async () => {
  try {
    // Crear registro de tipo "manual"
    const { error } = await supabase
      .from('registros_salida')
      .insert([{
        tipo: 'manual',
        estado: 'anunciado',
        nombre_manual: anuncioManual.value.nombre,
        apellido_manual: anuncioManual.value.apellido,
        grado_manual: anuncioManual.value.grado,
        seccion_manual: anuncioManual.value.seccion,
        anunciado_por: authStore.user?.id,
        fecha_hora: new Date().toISOString()
      }])
    
    if (error) throw error
    
    await cargarAnunciosRecientes()
    mostrarNotificacion('Anuncio manual realizado con éxito')
  } catch (error) {
    console.error('Error al registrar anuncio manual:', error)
  }
}

const marcarComoCompletado = async (registroId) => {
  await actualizarEstadoRegistro(registroId, 'completado')
  mostrarNotificacion('Registro marcado como completado')
}

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notificationMessage.value = mensaje
  showNotification.value = true
  
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const formatTimeDifference = (dateString) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now - past
  
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'menos de 1 minuto'
  if (diffMins === 1) return '1 minuto'
  if (diffMins < 60) return `${diffMins} minutos`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return '1 hora'
  return `${diffHours} horas`
}
</script>

<style scoped>
/* Animación de pulso para cuando está anunciando */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.pulse {
  animation: pulse 1.5s infinite;
}
</style> 