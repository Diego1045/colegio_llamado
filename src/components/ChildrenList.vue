<template>
  <div>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tus Hijos</h3>
      <div v-if="children.length > 0" class="space-y-4">
        <div 
          v-for="child in children" 
          :key="child.id"
          class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 transition"
        >
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-semibold text-lg text-gray-800 dark:text-white">{{ child.nombre }}</h4>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Grado {{ child.grado }}</p>
            </div>
            <button 
              @click="initiateCall(child)"
              :disabled="!isWithinSchoolHours"
              :class="[
                'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition',
                (!isWithinSchoolHours) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              Llamar
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <i class="fas fa-child text-4xl mb-2"></i>
        <p>No tienes hijos registrados en el sistema.</p>
      </div>
    </div>

    <!-- Call Modal -->
    <div 
      v-if="showCallModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <i class="fas fa-bell text-5xl text-blue-500 mb-4 pulse"></i>
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Llamando a {{ selectedChild?.nombre }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Por favor espera mientras notificamos a tu hijo/a.
          </p>
          <div class="flex justify-center space-x-4">
            <button 
              @click="showCallModal = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-gray-900 font-medium py-2 px-6 rounded-lg transition"
            >
              Cancelar
            </button>
            <button 
              @click="confirmCall"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div 
      v-if="showSuccessNotification"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const children = ref([])
const isWithinSchoolHours = ref(true)
const showCallModal = ref(false)
const selectedChild = ref(null)
const showSuccessNotification = ref(false)
const successMessage = ref('')

const props = defineProps({
  onCallInitiated: {
    type: Function,
    required: true
  }
})

onMounted(async () => {
  await loadChildren()
  checkSchoolHours()
})

const loadChildren = async () => {
  if (!authStore.user?.id) {
    console.error('No hay usuario autenticado')
    return
  }

  try {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .eq('padre_id', authStore.user.id)

    if (error) throw error
    children.value = data
  } catch (error) {
    console.error('Error loading children:', error)
  }
}

const checkSchoolHours = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  isWithinSchoolHours.value = (
    (currentHour === 13 && currentMinute >= 30) || 
    (currentHour === 14 && currentMinute <= 0)
  )
}

const initiateCall = (child) => {
  selectedChild.value = child
  showCallModal.value = true
}

const confirmCall = async () => {
  try {
    const { error } = await supabase
      .from('registros_salida')
      .insert([
        {
          estudiante_id: selectedChild.value.id,
          padre_id: authStore.user.id,
          estado: 'pendiente',
          fecha_hora: new Date().toISOString()
        }
      ])

    if (error) throw error

    showCallModal.value = false
    successMessage.value = `¡${selectedChild.value.nombre} ha sido notificado/a para salir!`
    showSuccessNotification.value = true

    setTimeout(() => {
      showSuccessNotification.value = false
    }, 5000)
  } catch (error) {
    console.error('Error al registrar la llamada:', error)
    alert('Error al registrar la llamada')
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