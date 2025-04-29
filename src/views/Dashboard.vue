<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <i class="fas fa-home text-3xl"></i>
            <h1 class="text-2xl font-bold">Panel de Control</h1>
          </div>
          <nav class="flex space-x-4">
            <router-link to="/perfil" class="text-white hover:text-blue-200 transition">
              <i class="fas fa-user mr-2"></i>Mi Perfil
            </router-link>
            <button @click="handleLogout" class="text-white hover:text-blue-200 transition">
              <i class="fas fa-sign-out-alt mr-2"></i>Cerrar Sesión
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Resumen de Estudiantes -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Mis Hijos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="estudiante in estudiantes" :key="estudiante.id" 
               class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex items-center space-x-4">
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
            <div class="mt-4">
              <button @click="llamarEstudiante(estudiante)" 
                      class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                <i class="fas fa-bell mr-2"></i>Llamar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Historial de Llamadas -->
      <section>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Historial de Llamadas</h2>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estudiante</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'

const router = useRouter()
const authStore = useAuthStore()
const estudiantes = ref([])
const registros = ref([])

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

const cargarRegistros = async () => {
  try {
    const { data, error } = await supabase
      .from('registros_salida')
      .select(`
        id,
        fecha_hora,
        estado,
        estudiantes (
          nombre,
          apellido
        )
      `)
      .eq('padre_id', authStore.user.id)
      .order('fecha_hora', { ascending: false })
      .limit(10)

    if (error) throw error
    registros.value = data.map(registro => ({
      ...registro,
      estudiante_nombre: `${registro.estudiantes.nombre} ${registro.estudiantes.apellido}`
    }))
  } catch (error) {
    console.error('Error al cargar registros:', error)
  }
}

const llamarEstudiante = async (estudiante) => {
  try {
    const { error } = await supabase
      .from('registros_salida')
      .insert([
        {
          estudiante_id: estudiante.id,
          padre_id: authStore.user.id,
          estado: 'pendiente',
          fecha_hora: new Date().toISOString()
        }
      ])

    if (error) throw error
    await cargarRegistros()
  } catch (error) {
    console.error('Error al llamar estudiante:', error)
  }
}

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/login')
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