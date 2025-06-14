<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mostrar mensaje de error si no tiene permisos -->
    <div v-if="!tienePermisos" class="container mx-auto px-4 py-8">
      <div class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
        <div class="flex items-center">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          <span>No tienes permisos para acceder a esta sección. Solo administradores pueden gestionar padres.</span>
        </div>
        <div class="mt-2">
          <router-link to="/dashboard" class="text-red-600 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-300">
            Volver al Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Contenido principal - solo mostrar si tiene permisos -->
    <div v-if="tienePermisos">
      <!-- Header -->
      <header class="bg-purple-600 text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <i class="fas fa-users text-3xl"></i>
              <h1 class="text-2xl font-bold">Gestión de Padres</h1>
            </div>
            <router-link to="/director" class="text-white hover:text-purple-200 transition">
              <i class="fas fa-arrow-left mr-2"></i>Volver al Panel
            </router-link>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- Buscar Padres -->
        <section class="mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Buscar Padres</h2>
              <div class="flex gap-4">
                <input 
                  v-model="busqueda" 
                  type="text" 
                  placeholder="Buscar por nombre o email"
                  class="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  @keyup.enter="buscarPadres"
                />
                <button 
                  @click="buscarPadres" 
                  class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div class="flex flex-wrap gap-4">
              <button 
                @click="mostrarFormulario = true; padreEditando = null"
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                <i class="fas fa-plus mr-2"></i>Crear Padre
              </button>
            </div>
          </div>
        </section>

        <!-- Lista de Padres -->
        <section class="mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Lista de Padres</h2>
            <div v-if="loading" class="flex justify-center my-8">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
            <div v-else-if="padres.length === 0" class="text-center py-8">
              <p class="text-gray-600 dark:text-gray-400">No se encontraron padres registrados</p>
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hijos</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="padre in padres" :key="padre.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ padre.nombre }} {{ padre.apellido }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-300">{{ padre.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-300">
                        <span class="text-xs inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full px-3 py-1">
                          {{ padre.hijos ? padre.hijos.length : 0 }} hijos
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex gap-3">
                        <button @click="editarPadre(padre)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button @click="asignarHijos(padre)" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          <i class="fas fa-child"></i>
                        </button>
                        <button @click="eliminarPadre(padre)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Formulario de Padre -->
        <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {{ padreEditando ? 'Editar Padre' : 'Crear Padre' }}
            </h3>
            <form @submit.prevent="guardarPadre" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  v-model="formPadre.nombre" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                <input 
                  type="text" 
                  v-model="formPadre.apellido" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  v-model="formPadre.email" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div v-if="!padreEditando">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  v-model="formPadre.password" 
                  :required="!padreEditando"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div class="flex justify-end space-x-2 pt-4">
                <button 
                  type="button" 
                  @click="mostrarFormulario = false"
                  class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  :disabled="loadingGuardar"
                  class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  {{ loadingGuardar ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal Asignar Hijos -->
        <div v-if="mostrarModalHijos" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                Asignar Hijos a {{ padreSelecionado?.nombre }} {{ padreSelecionado?.apellido }}
              </h3>
              <button @click="mostrarModalHijos = false" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <!-- Búsqueda de estudiantes -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar entre los hijos asignados</label>
              <div class="flex">
                <input 
                  v-model="busquedaEstudiantes" 
                  type="text" 
                  placeholder="Buscar por nombre"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  @input="filtrarHijosAsignados"
                />
                <button 
                  @click="mostrarFormularioHijo = true"
                  class="ml-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  <i class="fas fa-plus mr-1"></i>Nuevo Hijo
                </button>
              </div>
            </div>

            <!-- Secciones de hijos asignados y disponibles -->
            <div class="mb-4">
              <!-- Estudiantes asignados -->
              <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Hijos Asignados</h4>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto">
                  <div v-if="loadingHijos" class="flex justify-center my-8">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                  <div v-else-if="hijosAsignados.length === 0" class="text-center py-4">
                    <p class="text-gray-600 dark:text-gray-400">No hay hijos asignados</p>
                  </div>
                  <div v-else>
                    <div v-for="hijo in hijosAsignadosFiltrados" :key="hijo.id" class="bg-white dark:bg-gray-800 rounded p-2 mb-2 flex justify-between items-center">
                      <div>
                        <span class="font-medium">{{ hijo.nombre }} {{ hijo.apellido }}</span>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ hijo.grado }} - {{ hijo.seccion }}
                        </div>
                      </div>
                      <button @click="desasignarHijo(hijo)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <i class="fas fa-unlink"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button 
                @click="mostrarModalHijos = false" 
                class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>

        <!-- Formulario para crear hijo -->
        <div v-if="mostrarFormularioHijo" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Crear Nuevo Hijo
            </h3>
            <form @submit.prevent="guardarHijo" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  v-model="formHijo.nombre" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                <input 
                  type="text" 
                  v-model="formHijo.apellido" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grado</label>
                <select 
                  v-model="formHijo.grado" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Seleccionar grado</option>
                  <option v-for="grado in grados" :key="grado" :value="grado">{{ grado }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sección</label>
                <select 
                  v-model="formHijo.seccion" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Seleccionar sección</option>
                  <option v-for="seccion in secciones" :key="seccion" :value="seccion">{{ seccion }}</option>
                </select>
              </div>
              <div class="flex justify-end space-x-2 pt-4">
                <button 
                  type="button" 
                  @click="mostrarFormularioHijo = false"
                  class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  :disabled="loadingGuardarHijo"
                  class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  {{ loadingGuardarHijo ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../supabase'
import { useToast } from 'vue-toastification'

const toast = useToast()
const loading = ref(false)
const loadingGuardar = ref(false)
const loadingHijos = ref(false)
const loadingGuardarHijo = ref(false)
const padres = ref([])
const busqueda = ref('')
const mostrarFormulario = ref(false)
const padreEditando = ref(null)
const formPadre = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: ''
})
const mostrarModalHijos = ref(false)
const mostrarFormularioHijo = ref(false)
const padreSelecionado = ref(null)
const hijosAsignados = ref([])
const hijosAsignadosFiltrados = ref([])
const busquedaEstudiantes = ref('')
const formHijo = ref({
  nombre: '',
  apellido: '',
  grado: '',
  seccion: ''
})
const grados = [
  '1° Primaria', 
  '2° Primaria', 
  '3° Primaria', 
  '4° Primaria', 
  '5° Primaria', 
  '6° Secundaria',
  '7° Secundaria',
  '8° Secundaria',
  '9° Secundaria',
  '10° Secundaria',
  '11° Secundaria'
]
const secciones = ['', 'A', 'B', 'C', 'D', 'E']
const tienePermisos = ref(true) // Assuming the component has a ref to check permissions

onMounted(async () => {
  await cargarPadres()
})

// Cuando cambia la búsqueda, actualizar los estudiantes filtrados
watch(busquedaEstudiantes, () => {
  filtrarHijosAsignados()
})

const cargarPadres = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, nombre, apellido, role')
      .eq('role', 'padre')
    
    if (error) throw error
    
    // Obtener los hijos de cada padre
    const padresConHijos = []
    for (const padre of data) {
      const { data: relaciones, error: errorRelaciones } = await supabase
        .from('padres_estudiantes')
        .select('estudiante_id, estudiantes(id, nombre, apellido)')
        .eq('padre_id', padre.id)
      
      if (!errorRelaciones) {
        padre.hijos = relaciones.map(rel => rel.estudiantes)
      }
      padresConHijos.push(padre)
    }
    
    padres.value = padresConHijos
  } catch (error) {
    console.error('Error al cargar padres:', error)
    toast.error('Error al cargar la lista de padres')
  } finally {
    loading.value = false
  }
}

const buscarPadres = async () => {
  if (!busqueda.value.trim()) {
    await cargarPadres()
    return
  }
  
  loading.value = true
  try {
    const query = busqueda.value.toLowerCase().trim()
    const { data, error } = await supabase
      .from('users')
      .select('id, email, nombre, apellido, role')
      .eq('role', 'padre')
      .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%,email.ilike.%${query}%`)
    
    if (error) throw error
    
    // Obtener los hijos de cada padre
    const padresConHijos = []
    for (const padre of data) {
      const { data: relaciones, error: errorRelaciones } = await supabase
        .from('padres_estudiantes')
        .select('estudiante_id, estudiantes(id, nombre, apellido)')
        .eq('padre_id', padre.id)
      
      if (!errorRelaciones) {
        padre.hijos = relaciones.map(rel => rel.estudiantes)
      }
      padresConHijos.push(padre)
    }
    
    padres.value = padresConHijos
  } catch (error) {
    console.error('Error al buscar padres:', error)
    toast.error('Error al buscar padres')
  } finally {
    loading.value = false
  }
}

const editarPadre = (padre) => {
  padreEditando.value = padre
  formPadre.value = {
    nombre: padre.nombre,
    apellido: padre.apellido,
    email: padre.email,
    password: ''
  }
  mostrarFormulario.value = true
}

const guardarPadre = async () => {
  loadingGuardar.value = true
  try {
    if (padreEditando.value) {
      // Actualizar padre existente
      const { error } = await supabase
        .from('users')
        .update({
          nombre: formPadre.value.nombre,
          apellido: formPadre.value.apellido,
          email: formPadre.value.email.trim().toLowerCase()
        })
        .eq('id', padreEditando.value.id)
      
      if (error) throw error
      toast.success('Padre actualizado correctamente')
      // Cerrar formulario y recargar datos
      mostrarFormulario.value = false
      await cargarPadres()
    } else {
      // Normalizar el email
      const emailNormalizado = formPadre.value.email.trim().toLowerCase()
      
      // Primero verificamos si el usuario ya existe en nuestra tabla users
      const { data: existingUser, error: errorCheck } = await supabase
        .from('users')
        .select('id')
        .eq('email', emailNormalizado)
        .eq('role', 'padre')
        .maybeSingle()
        
      if (errorCheck) {
        console.error('Error al verificar usuario existente:', errorCheck)
      }
      
      // Si ya existe en nuestra tabla users, mostrar error
      if (existingUser) {
        toast.error('Este email ya está registrado como padre en el sistema')
        return
      }
      
      // Intentamos crear el usuario en auth
      const { data, error } = await supabase.auth.signUp({
        email: emailNormalizado,
        password: formPadre.value.password,
        options: {
          data: {
            role: 'padre',
            nombre: formPadre.value.nombre,
            apellido: formPadre.value.apellido
          }
        }
      })
      
      console.log('Respuesta auth.signUp:', data, error)
      
      // Verificar si hay un error específico que indique que el usuario ya existe
      if (error) {
        if (error.code === 'user_already_exists') {
          // Si el usuario ya existe en auth pero no en nuestra tabla
          console.log('El usuario ya existe en auth pero no en tabla users')
          
          // Consultar directo al director para obtener el ID
          // Esta sería la solución ideal, utilizando una función RPC en el servidor
          // para obtener el ID a partir del email
          toast.info('Este email ya está registrado en el sistema. Por favor, contacte al administrador para asociar este email a su cuenta de padre.')
          
          // Como alternativa, podríamos intentar que el usuario inicie sesión y
          // luego capturar el ID para crear el registro de padre, pero esto requiere
          // conocer la contraseña
        } else {
          // Otros errores
          console.error('Error en auth.signUp:', error)
          toast.error('Error al registrar: ' + error.message)
        }
        return
      }
      
      // Si no hay error pero identities está vacío, el email ya existe
      if (data && data.user && (!data.user.identities || data.user.identities.length === 0)) {
        console.log('Email ya existe (identities vacío)')
        toast.error('Este email ya está registrado en el sistema. Por favor, utilice otro email.')
        return
      }
      
      // Usuario creado correctamente, usar su ID
      if (data && data.user) {
        const userId = data.user.id
        
        try {
          const { error: errorUsers } = await supabase
            .from('users')
            .insert([{
              id: userId,
              email: emailNormalizado,
              nombre: formPadre.value.nombre,
              apellido: formPadre.value.apellido,
              role: 'padre'
            }])
          
          if (errorUsers) throw errorUsers
          
          toast.success('Padre creado correctamente')
          // Cerrar formulario y recargar datos
          mostrarFormulario.value = false
          await cargarPadres()
        } catch (errorInsert) {
          console.error('Error al insertar en la tabla users:', errorInsert)
          toast.error('Error al guardar la información del padre en la base de datos')
        }
      }
    }
  } catch (error) {
    console.error('Error al guardar padre:', error)
    toast.error('Error al guardar el padre: ' + error.message)
  } finally {
    loadingGuardar.value = false
  }
}

const eliminarPadre = async (padre) => {
  if (!confirm(`¿Estás seguro de eliminar a ${padre.nombre} ${padre.apellido}?`)) {
    return
  }
  
  try {
    // Eliminar relaciones padre-estudiante
    const { error: errorRelaciones } = await supabase
      .from('padres_estudiantes')
      .delete()
      .eq('padre_id', padre.id)
    
    if (errorRelaciones) throw errorRelaciones
    
    // Eliminar usuario de la tabla users
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', padre.id)
    
    if (error) throw error
    
    // Eliminar usuario de autenticación
    const { error: errorAuth } = await supabase.auth.admin.deleteUser(padre.id)
    if (errorAuth) {
      console.error('Error al eliminar usuario de autenticación:', errorAuth)
      // No interrumpimos el flujo si falla la eliminación en auth
    }
    
    toast.success('Padre eliminado correctamente')
    await cargarPadres()
  } catch (error) {
    console.error('Error al eliminar padre:', error)
    toast.error('Error al eliminar el padre')
  }
}

const asignarHijos = async (padre) => {
  padreSelecionado.value = padre
  mostrarModalHijos.value = true
  loadingHijos.value = true
  
  try {
    // Cargar hijos asignados
    const { data: relaciones, error: errorRelaciones } = await supabase
      .from('padres_estudiantes')
      .select('estudiantes(id, nombre, apellido, grado, seccion)')
      .eq('padre_id', padre.id)
    
    if (errorRelaciones) throw errorRelaciones
    hijosAsignados.value = relaciones.map(rel => rel.estudiantes)
    hijosAsignadosFiltrados.value = [...hijosAsignados.value]
  } catch (error) {
    console.error('Error al cargar relaciones:', error)
    toast.error('Error al cargar la información de los hijos')
  } finally {
    loadingHijos.value = false
  }
}

const filtrarHijosAsignados = () => {
  if (!busquedaEstudiantes.value.trim()) {
    hijosAsignadosFiltrados.value = hijosAsignados.value
    return
  }
  
  const termino = busquedaEstudiantes.value.toLowerCase().trim()
  hijosAsignadosFiltrados.value = hijosAsignados.value.filter(hijo =>
    hijo.nombre.toLowerCase().includes(termino) ||
    hijo.apellido.toLowerCase().includes(termino)
  )
}

const asignarHijo = async (estudiante) => {
  try {
    const { error } = await supabase
      .from('padres_estudiantes')
      .insert([{
        padre_id: padreSelecionado.value.id,
        estudiante_id: estudiante.id
      }])
    
    if (error) throw error
    
    // Actualizar la lista de hijos asignados
    hijosAsignados.value.push(estudiante)
    hijosAsignadosFiltrados.value.push(estudiante)
    
    // También actualizar la información del padre en la lista principal
    const padre = padres.value.find(p => p.id === padreSelecionado.value.id)
    if (padre && padre.hijos) {
      padre.hijos.push(estudiante)
    }
    
    toast.success(`${estudiante.nombre} asignado correctamente`)
  } catch (error) {
    console.error('Error al asignar hijo:', error)
    toast.error('Error al asignar el estudiante')
  }
}

const desasignarHijo = async (hijo) => {
  try {
    const { error } = await supabase
      .from('padres_estudiantes')
      .delete()
      .eq('padre_id', padreSelecionado.value.id)
      .eq('estudiante_id', hijo.id)
    
    if (error) throw error
    
    // Actualizar las listas
    hijosAsignados.value = hijosAsignados.value.filter(h => h.id !== hijo.id)
    hijosAsignadosFiltrados.value = hijosAsignadosFiltrados.value.filter(h => h.id !== hijo.id)
    
    toast.success(`${hijo.nombre} desasignado correctamente`)
  } catch (error) {
    console.error('Error al desasignar hijo:', error)
    toast.error('Error al desasignar el estudiante')
  }
}

const guardarHijo = async () => {
  loadingGuardarHijo.value = true
  try {
    // Verificar si ya existe un estudiante con los mismos datos
    const { data: estudiantesExistentes, error: errorBusqueda } = await supabase
      .from('estudiantes')
      .select('id')
      .eq('nombre', formHijo.value.nombre)
      .eq('apellido', formHijo.value.apellido)
      .eq('grado', formHijo.value.grado)
      .eq('seccion', formHijo.value.seccion)
    
    if (errorBusqueda) throw errorBusqueda
    
    // Si ya existe un estudiante con estos datos, mostrar error
    if (estudiantesExistentes && estudiantesExistentes.length > 0) {
      toast.error('Ya existe un estudiante con estos datos')
      return
    }
    
    // Insertar nuevo estudiante
    const { data: nuevoEstudiante, error } = await supabase
      .from('estudiantes')
      .insert([{
        nombre: formHijo.value.nombre,
        apellido: formHijo.value.apellido,
        grado: formHijo.value.grado,
        seccion: formHijo.value.seccion
      }])
      .select()
    
    if (error) throw error
    
    // Asignar inmediatamente al padre
    const estudiante = nuevoEstudiante[0]
    const { error: errorRelacion } = await supabase
      .from('padres_estudiantes')
      .insert([{
        padre_id: padreSelecionado.value.id,
        estudiante_id: estudiante.id
      }])
    
    if (errorRelacion) throw errorRelacion
    
    // Actualizar la lista de hijos asignados
    hijosAsignados.value.push(estudiante)
    hijosAsignadosFiltrados.value.push(estudiante)
    
    // También actualizar la información del padre en la lista principal
    const padre = padres.value.find(p => p.id === padreSelecionado.value.id)
    if (padre && padre.hijos) {
      padre.hijos.push(estudiante)
    }
    
    toast.success(`${estudiante.nombre} creado y asignado correctamente`)
    
    // Cerrar formulario y limpiar
    mostrarFormularioHijo.value = false
    formHijo.value = {
      nombre: '',
      apellido: '',
      grado: '',
      seccion: ''
    }
  } catch (error) {
    console.error('Error al crear hijo:', error)
    toast.error('Error al crear el estudiante: ' + error.message)
  } finally {
    loadingGuardarHijo.value = false
  }
}
</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4;
}

.table {
  @apply min-w-full divide-y divide-gray-200 dark:divide-gray-700;
}

.btn {
  @apply font-medium py-2 px-4 rounded-lg transition duration-300;
}

.btn-primary {
  @apply bg-purple-600 hover:bg-purple-700 text-white;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white;
}
</style> 