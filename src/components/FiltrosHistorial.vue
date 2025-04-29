<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filtros Avanzados</h3>
    
    <form @submit.prevent="aplicarFiltros" class="space-y-4">
      <!-- Filtro por fecha -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="fechaInicio" class="form-label">Fecha Inicio</label>
          <input 
            id="fechaInicio"
            type="date" 
            v-model="filtros.fechaInicio"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="fechaFin" class="form-label">Fecha Fin</label>
          <input 
            id="fechaFin"
            type="date" 
            v-model="filtros.fechaFin"
            class="form-input"
          >
        </div>
      </div>

      <!-- Filtro por estado -->
      <div class="form-group">
        <label for="estado" class="form-label">Estado</label>
        <select 
          id="estado"
          v-model="filtros.estado"
          class="form-input"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      <!-- Filtro por grado -->
      <div class="form-group">
        <label for="grado" class="form-label">Grado</label>
        <select 
          id="grado"
          v-model="filtros.grado"
          class="form-input"
        >
          <option value="">Todos</option>
          <option v-for="grado in grados" :key="grado" :value="grado">
            Grado {{ grado }}
          </option>
        </select>
      </div>

      <!-- Filtro por estudiante -->
      <div class="form-group">
        <label for="estudiante" class="form-label">Estudiante</label>
        <input 
          id="estudiante"
          type="text" 
          v-model="filtros.estudiante"
          class="form-input"
          placeholder="Buscar por nombre o apellido"
        >
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-2">
        <button 
          type="button" 
          @click="resetearFiltros"
          class="btn btn-secondary"
          aria-label="Resetear filtros"
        >
          <i class="fas fa-undo mr-2" aria-hidden="true"></i>Resetear
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          aria-label="Aplicar filtros"
        >
          <i class="fas fa-filter mr-2" aria-hidden="true"></i>Aplicar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const emit = defineEmits(['filtros-aplicados'])

const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  estado: '',
  grado: '',
  estudiante: ''
})

const grados = ref([])

onMounted(async () => {
  await cargarGrados()
})

const cargarGrados = async () => {
  try {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('grado')
      .order('grado', { ascending: true })

    if (error) throw error
    
    // Obtener grados únicos
    grados.value = [...new Set(data.map(e => e.grado))]
  } catch (error) {
    console.error('Error al cargar grados:', error)
  }
}

const aplicarFiltros = () => {
  emit('filtros-aplicados', { ...filtros.value })
}

const resetearFiltros = () => {
  filtros.value = {
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    grado: '',
    estudiante: ''
  }
  emit('filtros-aplicados', { ...filtros.value })
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
</style> 