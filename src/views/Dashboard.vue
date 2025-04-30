<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main Content -->
    <main class=" mx-auto px-4 py-8">
      <!-- Welcome Message -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Bienvenido, {{ user?.user_metadata?.nombre || 'Padre/Madre' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Aquí puedes gestionar la salida de tus hijos cuando estés cerca del colegio.
        </p>
      </div>

      <!-- Geolocation Status -->
      <GeolocationStatus ref="geolocationStatus" />

      <!-- Children List -->
      <ChildrenList />

      <!-- Schedule Info -->
      <ScheduleInfo />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import GeolocationStatus from '../components/GeolocationStatus.vue'
import ChildrenList from '../components/ChildrenList.vue'
import ScheduleInfo from '../components/ScheduleInfo.vue'

const router = useRouter()
const authStore = useAuthStore()
const user = ref(null)
const geolocationStatus = ref(null)

onMounted(async () => {
  user.value = authStore.user
})

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/login')
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
