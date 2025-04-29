<template>
  <div class="fixed top-4 right-4 z-50">
    <!-- Botón de notificaciones -->
    <button 
      @click="toggleNotificaciones" 
      class="relative p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg"
      aria-label="Ver notificaciones"
    >
      <i class="fas fa-bell text-gray-600 dark:text-gray-300 text-xl" aria-hidden="true"></i>
      <span 
        v-if="notificacionesNoLeidas > 0" 
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ notificacionesNoLeidas }}
      </span>
    </button>

    <!-- Panel de notificaciones -->
    <div 
      v-if="mostrarPanel" 
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notificaciones-title"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 id="notificaciones-title" class="text-lg font-semibold text-gray-800 dark:text-white">
            Notificaciones
          </h3>
          <button 
            @click="marcarTodasComoLeidas" 
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            aria-label="Marcar todas como leídas"
          >
            Marcar todas como leídas
          </button>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="notificaciones.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No hay notificaciones
          </div>
          <div v-else>
            <div 
              v-for="notificacion in notificaciones" 
              :key="notificacion.id"
              class="p-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
              :class="{ 'bg-blue-50 dark:bg-blue-900': !notificacion.leida }"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <i 
                    :class="getIconoNotificacion(notificacion.tipo)" 
                    class="text-lg"
                    aria-hidden="true"
                  ></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 dark:text-white">
                    {{ notificacion.mensaje }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatFecha(notificacion.created_at) }}
                  </p>
                </div>
                <button 
                  v-if="!notificacion.leida"
                  @click="marcarComoLeida(notificacion)"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Marcar como leída"
                >
                  <i class="fas fa-check" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'

const notificaciones = ref([])
const mostrarPanel = ref(false)
const notificacionesNoLeidas = ref(0)

// Suscripción a notificaciones en tiempo real
let notificacionesSubscription

onMounted(async () => {
  await cargarNotificaciones()
  suscribirANotificaciones()
})

onUnmounted(() => {
  if (notificacionesSubscription) {
    notificacionesSubscription.unsubscribe()
  }
})

const cargarNotificaciones = async () => {
  try {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    notificaciones.value = data
    actualizarContadorNoLeidas()
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
  }
}

const suscribirANotificaciones = () => {
  notificacionesSubscription = supabase
    .channel('notificaciones')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notificaciones'
      },
      async (payload) => {
        notificaciones.value.unshift(payload.new)
        actualizarContadorNoLeidas()
      }
    )
    .subscribe()
}

const actualizarContadorNoLeidas = () => {
  notificacionesNoLeidas.value = notificaciones.value.filter(n => !n.leida).length
}

const toggleNotificaciones = () => {
  mostrarPanel.value = !mostrarPanel.value
}

const marcarComoLeida = async (notificacion) => {
  try {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', notificacion.id)

    if (error) throw error
    notificacion.leida = true
    actualizarContadorNoLeidas()
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error)
  }
}

const marcarTodasComoLeidas = async () => {
  try {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('leida', false)

    if (error) throw error
    notificaciones.value.forEach(n => n.leida = true)
    actualizarContadorNoLeidas()
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error)
  }
}

const getIconoNotificacion = (tipo) => {
  const iconos = {
    llamada: 'fas fa-phone text-blue-500',
    usuario: 'fas fa-user text-green-500',
    sistema: 'fas fa-cog text-gray-500',
    alerta: 'fas fa-exclamation-triangle text-yellow-500'
  }
  return iconos[tipo] || iconos.sistema
}

const formatFecha = (fecha) => {
  const ahora = new Date()
  const notificacionFecha = new Date(fecha)
  const diff = ahora - notificacionFecha

  // Menos de 1 minuto
  if (diff < 60000) return 'Ahora mismo'
  
  // Menos de 1 hora
  if (diff < 3600000) {
    const minutos = Math.floor(diff / 60000)
    return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`
  }
  
  // Menos de 24 horas
  if (diff < 86400000) {
    const horas = Math.floor(diff / 3600000)
    return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`
  }
  
  // Más de 24 horas
  return notificacionFecha.toLocaleDateString()
}
</script>

<style scoped>
/* Estilos específicos para el modo oscuro */
.dark .bg-white {
  background-color: #2d2d2d;
}
.dark .text-gray-800 {
  color: #FFFFFF;
}
.dark .border-gray-200 {
  border-color: #404040;
}
</style> 