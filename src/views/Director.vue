<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Botón de tema oscuro -->
    <div class="fixed top-4 right-4">
      <button 
        @click="toggleTheme" 
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        aria-label="Cambiar tema"
      >
        <i class="fas fa-sun text-yellow-500 dark:hidden"></i>
        <i class="fas fa-moon text-blue-300 hidden dark:block"></i>
      </button>
    </div>


    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Estadísticas -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Estadísticas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Estudiantes</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ estadisticas.totalEstudiantes }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <i class="fas fa-user-graduate text-blue-600 dark:text-blue-300 text-xl" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Llamadas Hoy</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ estadisticas.llamadasHoy }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <i class="fas fa-bell text-green-600 dark:text-green-300 text-xl" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Padres Registrados</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ estadisticas.totalPadres }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <i class="fas fa-users text-purple-600 dark:text-purple-300 text-xl" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos y Reportes -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Gráfico de Llamadas por Día -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Llamadas por Día</h3>
            <div class="h-64">
              <canvas ref="llamadasChart" aria-label="Gráfico de llamadas por día"></canvas>
            </div>
          </div>

          <!-- Gráfico de Distribución por Grado -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Estudiantes por Grado</h3>
            <div class="h-64">
              <canvas ref="gradosChart" aria-label="Gráfico de distribución de estudiantes por grado"></canvas>
            </div>
          </div>

          <!-- Reporte de Llamadas Recientes -->
          <div class="card">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Llamadas Recientes</h3>
              <button 
                @click="exportarReporte('llamadas')" 
                class="btn btn-primary"
                aria-label="Exportar reporte de llamadas"
              >
                <i class="fas fa-download mr-1" aria-hidden="true"></i>Exportar
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Estudiante</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="llamada in llamadasRecientes" :key="llamada.id">
                    <td>{{ llamada.estudiante_nombre }}</td>
                    <td>{{ formatDate(llamada.fecha_hora) }}</td>
                    <td>
                      <span :class="getStatusClass(llamada.estado)">
                        {{ llamada.estado }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Reporte de Códigos de Invitación -->
          <div class="card">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Estadísticas de Códigos</h3>
              <button 
                @click="exportarReporte('codigos')" 
                class="btn btn-primary"
                aria-label="Exportar reporte de códigos"
              >
                <i class="fas fa-download mr-1" aria-hidden="true"></i>Exportar
              </button>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estadisticas.codigosDisponibles }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Disponibles</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estadisticas.codigosUsados }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Usados</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ estadisticas.codigosInvalidos }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">Invalidados</p>
              </div>
            </div>
            <div class="h-64">
              <canvas ref="codigosChart" aria-label="Gráfico de distribución de códigos"></canvas>
            </div>
          </div>
        </div>
      </section>

      <!-- Gestión de Usuarios -->
      <section class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h2>
          <div class="flex space-x-2">
            <router-link 
              to="/padres"
              class="btn btn-secondary"
              aria-label="Gestionar padres"
            >
              <i class="fas fa-users mr-2" aria-hidden="true"></i>Gestionar Padres
            </router-link>
            <button 
              @click="mostrarFormularioUsuario = true"
              class="btn btn-primary"
              aria-label="Agregar nuevo usuario"
            >
              <i class="fas fa-plus mr-2" aria-hidden="true"></i>Nuevo Usuario
            </button>
          </div>
        </div>
        <div class="card">
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Email</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="usuario in usuarios" :key="usuario.id">
                  <td>{{ usuario.nombre }} {{ usuario.apellido }}</td>
                  <td>{{ usuario.email }}</td>
                  <td>{{ usuario.rol }}</td>
                  <td>
                    <span :class="getStatusClass(usuario.estado)">
                      {{ usuario.estado }}
                    </span>
                  </td>
                  <td>
                    <div class="flex space-x-2">
                      <button 
                        @click="editarUsuario(usuario)" 
                        class="btn btn-secondary"
                        aria-label="Editar usuario"
                      >
                        <i class="fas fa-edit" aria-hidden="true"></i>
                      </button>
                      <button 
                        @click="eliminarUsuario(usuario)" 
                        class="btn btn-danger"
                        aria-label="Eliminar usuario"
                      >
                        <i class="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Gestión de Códigos de Invitación -->
      <section class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Códigos de Invitación</h2>
          <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div class="flex items-center space-x-2">
              <input 
                type="number" 
                v-model="cantidadCodigos" 
                min="1" 
                max="10"
                class="form-input w-20"
                aria-label="Cantidad de códigos a generar"
              >
              <button 
                @click="generarCodigos" 
                :disabled="loadingCodigos"
                class="btn btn-primary"
                aria-label="Generar códigos"
              >
                {{ loadingCodigos ? 'Generando...' : 'Generar Códigos' }}
              </button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha de Generación</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="codigo in codigos" :key="codigo.id">
                  <td class="font-mono">{{ codigo.codigo }}</td>
                  <td>
                    <span :class="getStatusClass(codigo.estado)">
                      {{ codigo.estado }}
                    </span>
                  </td>
                  <td>{{ formatDate(codigo.created_at) }}</td>
                  <td>
                    <div class="flex space-x-2">
                      <button 
                        @click="copiarCodigo(codigo.codigo)" 
                        class="btn btn-secondary"
                        aria-label="Copiar código"
                      >
                        <i class="fas fa-copy" aria-hidden="true"></i>
                      </button>
                      <button 
                        @click="invalidarCodigo(codigo)" 
                        class="btn btn-danger"
                        aria-label="Invalidar código"
                      >
                        <i class="fas fa-ban" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Formulario de Usuario -->
      <div 
        v-if="mostrarFormularioUsuario" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 id="modal-title" class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <form @submit.prevent="guardarUsuario" class="space-y-4">
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre</label>
              <input 
                id="nombre"
                type="text" 
                v-model="formUsuario.nombre" 
                required
                class="form-input"
                aria-required="true"
              >
            </div>
            <div class="form-group">
              <label for="apellido" class="form-label">Apellido</label>
              <input 
                id="apellido"
                type="text" 
                v-model="formUsuario.apellido" 
                required
                class="form-input"
                aria-required="true"
              >
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                id="email"
                type="email" 
                v-model="formUsuario.email" 
                required
                class="form-input"
                aria-required="true"
              >
            </div>
            <div class="form-group">
              <label for="rol" class="form-label">Rol</label>
              <select 
                id="rol"
                v-model="formUsuario.rol" 
                required
                class="form-input"
                aria-required="true"
              >
                <option value="padre">Padre</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div v-if="!usuarioEditando" class="form-group">
              <label for="password" class="form-label">Contraseña</label>
              <input 
                id="password"
                type="password" 
                v-model="formUsuario.password" 
                required
                class="form-input"
                aria-required="true"
              >
            </div>
            <div class="flex justify-end space-x-2 pt-4">
              <button 
                type="button" 
                @click="cerrarFormularioUsuario"
                class="btn btn-secondary"
                aria-label="Cancelar"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="loading"
                class="btn btn-primary"
                aria-label="Guardar usuario"
              >
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'
import { Chart } from 'chart.js/auto'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const loadingCodigos = ref(false)
const usuarios = ref([])
const mostrarFormularioUsuario = ref(false)
const usuarioEditando = ref(null)
const formUsuario = ref({
  nombre: '',
  apellido: '',
  email: '',
  rol: 'padre',
  password: ''
})
const cantidadCodigos = ref(1)
const codigos = ref([])
const llamadasChart = ref(null)
const gradosChart = ref(null)
const codigosChart = ref(null)
const llamadasRecientes = ref([])
const chartInstances = ref([])

const estadisticas = ref({
  totalEstudiantes: 0,
  llamadasHoy: 0,
  totalPadres: 0,
  codigosDisponibles: 0,
  codigosUsados: 0,
  codigosInvalidos: 0
})

onMounted(async () => {
  await cargarUsuarios()
  await cargarEstadisticas()
  await cargarCodigos()
  await cargarLlamadasRecientes()
  await cargarDatosGraficos()
})

onUnmounted(() => {
  chartInstances.value.forEach(chart => chart.destroy())
})

const cargarUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    usuarios.value = data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

const cargarEstadisticas = async () => {
  try {
    // Total de estudiantes
    const { data: estudiantes, error: errorEstudiantes } = await supabase
      .from('estudiantes')
      .select('id', { count: 'exact' })

    if (errorEstudiantes) throw errorEstudiantes
    estadisticas.value.totalEstudiantes = estudiantes.length

    // Llamadas de hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const { data: llamadas, error: errorLlamadas } = await supabase
      .from('registros_salida')
      .select('id', { count: 'exact' })
      .gte('fecha_hora', hoy.toISOString())

    if (errorLlamadas) throw errorLlamadas
    estadisticas.value.llamadasHoy = llamadas.length

    // Total de padres
    const { data: padres, error: errorPadres } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact' })
      .eq('rol', 'padre')

    if (errorPadres) throw errorPadres
    estadisticas.value.totalPadres = padres.length

    // Estadísticas de códigos
    const { data: codigos, error: errorCodigos } = await supabase
      .from('codigos_invitacion')
      .select('estado', { count: 'exact' })
      .group('estado')

    if (errorCodigos) throw errorCodigos
    codigos.forEach(codigo => {
      if (codigo.estado === 'disponible') estadisticas.value.codigosDisponibles = codigo.count
      if (codigo.estado === 'usado') estadisticas.value.codigosUsados = codigo.count
      if (codigo.estado === 'invalido') estadisticas.value.codigosInvalidos = codigo.count
    })
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
}

const cargarCodigos = async () => {
  try {
    const { data, error } = await supabase
      .from('codigos_invitacion')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    codigos.value = data
  } catch (error) {
    console.error('Error al cargar códigos:', error)
  }
}

const cargarLlamadasRecientes = async () => {
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
      .order('fecha_hora', { ascending: false })
      .limit(5)

    if (error) throw error
    llamadasRecientes.value = data.map(llamada => ({
      ...llamada,
      estudiante_nombre: `${llamada.estudiantes.nombre} ${llamada.estudiantes.apellido}`
    }))
  } catch (error) {
    console.error('Error al cargar llamadas recientes:', error)
  }
}

const cargarDatosGraficos = async () => {
  try {
    // Datos para gráfico de llamadas por día
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - i)
      return fecha.toISOString().split('T')[0]
    }).reverse()

    const { data: llamadasPorDia, error: errorLlamadas } = await supabase
      .from('registros_salida')
      .select('fecha_hora')
      .in('fecha_hora', ultimos7Dias)

    if (errorLlamadas) throw errorLlamadas

    const llamadasPorDiaCount = ultimos7Dias.map(fecha => {
      return llamadasPorDia.filter(llamada => 
        llamada.fecha_hora.startsWith(fecha)
      ).length
    })

    // Datos para gráfico de estudiantes por grado
    const { data: estudiantesPorGrado, error: errorEstudiantes } = await supabase
      .from('estudiantes')
      .select('grado', { count: 'exact' })
      .group('grado')

    if (errorEstudiantes) throw errorEstudiantes

    // Crear gráficos
    crearGraficoLlamadas(ultimos7Dias, llamadasPorDiaCount)
    crearGraficoGrados(estudiantesPorGrado)
    crearGraficoCodigos()
  } catch (error) {
    console.error('Error al cargar datos para gráficos:', error)
  }
}

const crearGraficoLlamadas = (labels, data) => {
  const ctx = llamadasChart.value.getContext('2d')
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map(fecha => new Date(fecha).toLocaleDateString()),
      datasets: [{
        label: 'Llamadas',
        data: data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
  chartInstances.value.push(chart)
}

const crearGraficoGrados = (data) => {
  const ctx = gradosChart.value.getContext('2d')
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => `Grado ${item.grado}`),
      datasets: [{
        label: 'Estudiantes',
        data: data.map(item => item.count),
        backgroundColor: '#8B5CF6',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
  chartInstances.value.push(chart)
}

const crearGraficoCodigos = () => {
  const ctx = codigosChart.value.getContext('2d')
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Disponibles', 'Usados', 'Invalidados'],
      datasets: [{
        data: [
          estadisticas.value.codigosDisponibles,
          estadisticas.value.codigosUsados,
          estadisticas.value.codigosInvalidos
        ],
        backgroundColor: [
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
  chartInstances.value.push(chart)
}

const editarUsuario = (usuario) => {
  usuarioEditando.value = usuario
  formUsuario.value = { ...usuario }
  mostrarFormularioUsuario.value = true
}

const eliminarUsuario = async (usuario) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return

  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', usuario.id)

    if (error) throw error
    await cargarUsuarios()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    alert('Error al eliminar el usuario')
  }
}

const guardarUsuario = async () => {
  try {
    loading.value = true
    if (usuarioEditando.value) {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nombre: formUsuario.value.nombre,
          apellido: formUsuario.value.apellido,
          email: formUsuario.value.email,
          rol: formUsuario.value.rol,
          updated_at: new Date().toISOString()
        })
        .eq('id', usuarioEditando.value.id)

      if (error) throw error
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: formUsuario.value.email,
        password: formUsuario.value.password,
        options: {
          data: {
            nombre: formUsuario.value.nombre,
            apellido: formUsuario.value.apellido,
            rol: formUsuario.value.rol
          }
        }
      })

      if (error) throw error

      const { error: dbError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: data.user.id,
            nombre: formUsuario.value.nombre,
            apellido: formUsuario.value.apellido,
            email: formUsuario.value.email,
            rol: formUsuario.value.rol
          }
        ])

      if (dbError) throw dbError
    }

    await cargarUsuarios()
    cerrarFormularioUsuario()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
    alert('Error al guardar el usuario')
  } finally {
    loading.value = false
  }
}

const cerrarFormularioUsuario = () => {
  mostrarFormularioUsuario.value = false
  usuarioEditando.value = null
  formUsuario.value = {
    nombre: '',
    apellido: '',
    email: '',
    rol: 'padre',
    password: ''
  }
}

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/login')
}

const generarCodigo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  codigo += '-'
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return codigo
}

const generarCodigos = async () => {
  try {
    loadingCodigos.value = true
    const nuevosCodigos = []
    
    for (let i = 0; i < cantidadCodigos.value; i++) {
      const codigo = generarCodigo()
      const { error } = await supabase
        .from('codigos_invitacion')
        .insert([
          {
            codigo,
            estado: 'disponible',
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error
      nuevosCodigos.push(codigo)
    }

    await cargarCodigos()
    alert('Códigos generados exitosamente')
  } catch (error) {
    console.error('Error al generar códigos:', error)
    alert('Error al generar los códigos')
  } finally {
    loadingCodigos.value = false
  }
}

const copiarCodigo = async (codigo) => {
  try {
    await navigator.clipboard.writeText(codigo)
    alert('Código copiado al portapapeles')
  } catch (error) {
    console.error('Error al copiar código:', error)
    alert('Error al copiar el código')
  }
}

const invalidarCodigo = async (codigo) => {
  if (!confirm('¿Estás seguro de que deseas invalidar este código?')) return

  try {
    const { error } = await supabase
      .from('codigos_invitacion')
      .update({ estado: 'invalido' })
      .eq('id', codigo.id)

    if (error) throw error
    await cargarCodigos()
  } catch (error) {
    console.error('Error al invalidar código:', error)
    alert('Error al invalidar el código')
  }
}

const getStatusClass = (status) => {
  const classes = {
    disponible: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    usado: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    invalido: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || classes.disponible
}

const formatDate = (date) => {
  const formattedDate = new Date(date).toLocaleDateString()
  const formattedTime = new Date(date).toLocaleTimeString()
  return `${formattedDate} ${formattedTime}`
}

const exportarReporte = async (tipo) => {
  try {
    let data, filename
    if (tipo === 'llamadas') {
      const { data: llamadas, error } = await supabase
        .from('registros_salida')
        .select(`
          fecha_hora,
          estado,
          estudiantes (
            nombre,
            apellido
          )
        `)
        .order('fecha_hora', { ascending: false })

      if (error) throw error
      data = llamadas.map(llamada => ({
        'Estudiante': `${llamada.estudiantes.nombre} ${llamada.estudiantes.apellido}`,
        'Fecha': new Date(llamada.fecha_hora).toLocaleString(),
        'Estado': llamada.estado
      }))
      filename = 'reporte_llamadas.csv'
    } else {
      const { data: codigos, error } = await supabase
        .from('codigos_invitacion')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      data = codigos.map(codigo => ({
        'Código': codigo.codigo,
        'Estado': codigo.estado,
        'Fecha de Generación': new Date(codigo.created_at).toLocaleString()
      }))
      filename = 'reporte_codigos.csv'
    }

    const csv = convertToCSV(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  } catch (error) {
    console.error('Error al exportar reporte:', error)
    alert('Error al exportar el reporte')
  }
}

const convertToCSV = (data) => {
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(header => 
      JSON.stringify(row[header])
    ).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}
</script>

<style>
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
.dark .bg-gray-50 {
  background-color: #333333;
}
.dark .text-gray-500 {
  color: #FFFFFF;
}
.dark .bg-gray-100 {
  background-color: #404040;
}
.dark .hover\:bg-gray-100:hover {
  background-color: #4d4d4d;
}
.dark .bg-purple-600 {
  background-color: #7c3aed;
}
.dark .hover\:bg-purple-700:hover {
  background-color: #6d28d9;
}
.dark .bg-green-100 {
  background-color: #064e3b;
}
.dark .text-green-800 {
  color: #6ee7b7;
}
.dark table {
  border-color: #404040;
}
.dark th {
  background-color: #333333;
  color: #f3f4f6;
}
.dark td {
  border-color: #404040;
}
.dark .text-red-600 {
  color: #f87171;
}
.dark .hover\:text-red-900:hover {
  color: #ef4444;
}
.dark .text-gray-600 {
  color: #FFFFFF;
}
</style>
