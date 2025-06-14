<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main Content -->
    <main class="mx-auto px-4 py-8">
      <!-- Header con opciones de usuario -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Panel de Control</h1>
        <div class="flex gap-2">
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <i class="fas" :class="isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-gray-600'"></i>
          </button>
          <router-link 
            to="/perfil" 
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
          >
            <i class="fas fa-user"></i>
          </router-link>
          <button 
            @click="handleLogout" 
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <i class="fas fa-sign-out-alt mr-1"></i> Salir
          </button>
        </div>
      </div>
      
      <!-- Welcome Message -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Bienvenido, {{ user?.user_metadata?.nombre || 'Usuario' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          {{ isAdmin ? 'Gestiona el sistema de llamado de estudiantes' : 'Aquí puedes gestionar la salida de tus hijos cuando estés cerca del colegio' }}.
        </p>
        
        <!-- Indicador de entorno local -->
        <div v-if="isLocalEnv" class="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-yellow-800 dark:text-yellow-200 text-sm">
          <i class="fas fa-code mr-1"></i> Entorno de desarrollo local - Todas las funcionalidades están disponibles
        </div>
      </div>

      <!-- Módulos - Grid de tarjetas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Módulo para padres: Llamado de estudiantes -->
        <router-link 
          v-if="!isAdmin || isLocalEnv"
          to="/estudiantes" 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col h-full"
        >
          <div class="flex items-center justify-center mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-full w-16 h-16">
            <i class="fas fa-child text-2xl text-blue-500 dark:text-blue-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Llamar a mis hijos</h3>
          <p class="text-gray-600 dark:text-gray-300 flex-grow">
            Notifica al colegio que has llegado para recoger a tus hijos.
          </p>
          <div class="mt-4 flex justify-end">
            <span class="text-blue-500 dark:text-blue-400">Acceder <i class="fas fa-arrow-right ml-1"></i></span>
          </div>
        </router-link>

        <!-- Módulo para administradores: Sistema de anuncios (NUEVO) -->
        <router-link 
          v-if="userRole === 'admin' || userRole === 'docente' || isLocalEnv"
          to="/anuncios" 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col h-full border-l-4 border-blue-500"
        >
          <div class="flex items-center justify-center mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-full w-16 h-16">
            <i class="fas fa-microphone text-2xl text-blue-500 dark:text-blue-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Sistema de Anuncios</h3>
          <p class="text-gray-600 dark:text-gray-300 flex-grow">
            Llama a los estudiantes por micrófono cuando sus representantes llegan.
          </p>
          <div class="flex justify-between items-center mt-4">
            <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">Nuevo</span>
            <span class="text-blue-500 dark:text-blue-400">Acceder <i class="fas fa-arrow-right ml-1"></i></span>
          </div>
        </router-link>

        <!-- Módulo para administradores: Gestión de padres -->
        <router-link 
          v-if="userRole === 'admin' || isLocalEnv"
          to="/padres" 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col h-full"
        >
          <div class="flex items-center justify-center mb-4 p-4 bg-purple-50 dark:bg-purple-900 rounded-full w-16 h-16">
            <i class="fas fa-users text-2xl text-purple-500 dark:text-purple-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Gestión de Padres</h3>
          <p class="text-gray-600 dark:text-gray-300 flex-grow">
            Administra los padres y sus relaciones con los estudiantes.
          </p>
          <div class="mt-4 flex justify-end">
            <span class="text-purple-500 dark:text-purple-400">Acceder <i class="fas fa-arrow-right ml-1"></i></span>
          </div>
        </router-link>
        
        <!-- Módulo para todos: Historial de registros -->
        <router-link 
          to="/registros" 
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col h-full"
        >
          <div class="flex items-center justify-center mb-4 p-4 bg-green-50 dark:bg-green-900 rounded-full w-16 h-16">
            <i class="fas fa-history text-2xl text-green-500 dark:text-green-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Historial de Registros</h3>
          <p class="text-gray-600 dark:text-gray-300 flex-grow">
            Consulta el historial de llamados y salidas de los estudiantes.
          </p>
          <div class="mt-4 flex justify-end">
            <span class="text-green-500 dark:text-green-400">Acceder <i class="fas fa-arrow-right ml-1"></i></span>
          </div>
        </router-link>
      </div>

      <!-- Componentes específicos según el tipo de usuario -->
      <div v-if="!isAdmin || isLocalEnv">
        <!-- Geolocation Status -->
        <GeolocationStatus ref="geolocationStatus" />

        <!-- Children List -->
        <ChildrenList :onCallInitiated="handleCallInitiated" />
      </div>

      <!-- Schedule Info -->
      <ScheduleInfo />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import GeolocationStatus from '../components/GeolocationStatus.vue'
import ChildrenList from '../components/ChildrenList.vue'
import ScheduleInfo from '../components/ScheduleInfo.vue'
import { supabase } from '../supabase'

const router = useRouter()
const authStore = useAuthStore()
const user = ref(null)
const userRole = ref(null)
const geolocationStatus = ref(null)
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

// Obtener el entorno de la aplicación
const APP_ENV = import.meta.env.VITE_APP_ENV || 'production'
const isLocalEnv = computed(() => APP_ENV === 'local')

const isAdmin = computed(() => {
  // En entorno local, permitir acceso a funciones admin
  if (isLocalEnv.value) return true
  return userRole.value === 'admin'
})

onMounted(async () => {
  user.value = authStore.user
  
  // Configurar el tema oscuro/claro al cargar la página
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Cargar el rol del usuario
  if (authStore.user) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', authStore.user.id)
        .single()

      if (!error && data) {
        userRole.value = data.role
      }
    } catch (err) {
      console.error('Error al cargar rol del usuario:', err)
    }
  }
  
  // En entorno local, mostrar mensaje en la consola
  if (isLocalEnv.value) {
    console.log('Entorno local: Mostrando todas las funcionalidades independientemente del rol')
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

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/login')
}

const handleCallInitiated = () => {
  if (geolocationStatus.value) {
    geolocationStatus.value.checkGeolocation()
  }
}
</script>

<style>
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>
