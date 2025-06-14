<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Mostrar mensaje de error si no tiene permisos -->
    <div v-if="!tienePermisos" class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        <span>No tienes permisos para acceder a esta sección. Solo administradores y docentes pueden gestionar anuncios.</span>
      </div>
      <div class="mt-2">
        <router-link to="/dashboard" class="text-red-600 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-300">
          Volver al Dashboard
        </router-link>
      </div>
    </div>

    <!-- Contenido principal - solo mostrar si tiene permisos -->
    <div v-if="tienePermisos">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Sistema de Anuncios</h1>
        <div class="flex space-x-2">
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <i class="fas" :class="isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-gray-600'"></i>
          </button>
          <router-link 
            to="/dashboard" 
            class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition flex items-center"
          >
            <i class="fas fa-arrow-left mr-2"></i> Volver
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Panel lateral con información y atajos -->
        <div class="lg:col-span-3 space-y-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Información</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Este sistema permite realizar anuncios por micrófono para llamar a los estudiantes cuando sus representantes llegan a buscarlos.
            </p>
            <div class="border-t dark:border-gray-700 pt-4 mt-4">
              <h4 class="font-medium text-gray-800 dark:text-white mb-2">Estado del sistema</h4>
              <div class="flex items-center text-green-500">
                <i class="fas fa-check-circle mr-2"></i>
                <span>Sistema activo</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Acciones rápidas</h3>
            <div class="space-y-2">
              <button 
                @click="toggleSonido" 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
              >
                <i class="fas" :class="sonidoActivado ? 'fa-volume-up' : 'fa-volume-mute'" mr-2></i>
                {{ sonidoActivado ? 'Desactivar sonido' : 'Activar sonido' }}
              </button>
              <button 
                @click="realizarPruebaAudio" 
                class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
              >
                <i class="fas fa-headset mr-2"></i>
                Prueba de audio
              </button>
            </div>
          </div>
        </div>

        <!-- Componente principal de anuncios -->
        <div class="lg:col-span-9">
          <AnuncioMicrofono />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'
import AnuncioMicrofono from '../components/AnuncioMicrofono.vue'

const router = useRouter()
const authStore = useAuthStore()

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
const sonidoActivado = ref(true)
const userRole = ref(null)
const loading = ref(true)

// Obtener el entorno de la aplicación
const APP_ENV = import.meta.env.VITE_APP_ENV || 'production'
const isLocalEnv = computed(() => APP_ENV === 'local')

// Verificar si el usuario tiene permisos para acceder a esta sección
const tienePermisos = computed(() => {
  if (isLocalEnv.value) return true // En entorno local, permitir acceso
  return userRole.value === 'admin' || userRole.value === 'docente'
})

onMounted(async () => {
  // Verificar autenticación
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Obtener el rol del usuario
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', authStore.user.id)
      .single()

    if (!error && data) {
      userRole.value = data.role
    }

    // Si no tiene permisos y no está en entorno local, redirigir después de 3 segundos
    if (!tienePermisos.value && !isLocalEnv.value) {
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    }
  } catch (err) {
    console.error('Error al verificar permisos:', err)
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
  
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const toggleSonido = () => {
  sonidoActivado.value = !sonidoActivado.value
  // Aquí podríamos implementar lógica para activar/desactivar el sonido globalmente
}

const realizarPruebaAudio = () => {
  if (!sonidoActivado.value) {
    sonidoActivado.value = true
  }
  
  const voiceSynthesis = window.speechSynthesis
  if (voiceSynthesis) {
    voiceSynthesis.cancel() // Cancelar cualquier anuncio en curso
    
    const utterance = new SpeechSynthesisUtterance("Este es un mensaje de prueba del sistema de anuncios.")
    
    // Configurar voz en español si está disponible
    const voices = voiceSynthesis.getVoices()
    const spanishVoice = voices.find(voice => voice.lang.includes('es'))
    if (spanishVoice) {
      utterance.voice = spanishVoice
    }
    
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    
    voiceSynthesis.speak(utterance)
  }
}

// Configurar el tema oscuro/claro al cargar la página
if (isDarkMode.value) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
</script> 