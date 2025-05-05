<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Ubicación Actual</h3>
    <div class="map-container mb-4">
      <div class="map-placeholder">
        <i class="fas fa-map-marker-alt text-4xl mb-2"></i>
        <p>Verificando tu ubicación...</p>
      </div>
    </div>
    <div class="flex items-center">
      <div :class="[
        'w-4 h-4 rounded-full mr-2',
        isWithinSchoolZone ? 'bg-green-500' : 'bg-red-500'
      ]"></div>
      <span class="text-gray-600 dark:text-gray-300">
        {{ locationStatus }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isWithinSchoolZone = ref(false)
const locationStatus = ref('Esperando acceso a la ubicación...')
const watchId = ref(null)

// School coordinates (Vía Bocono area)
//7.8883487,-72.50237
const schoolLocation = {
  lat: 7.8883487,
  lng: -72.50237
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3
  const φ1 = lat1 * Math.PI/180
  const φ2 = lat2 * Math.PI/180
  const Δφ = (lat2-lat1) * Math.PI/180
  const Δλ = (lon2-lon1) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

const checkGeolocation = () => {
  if (!navigator.geolocation) {
    locationStatus.value = "Geolocalización no soportada por tu navegador"
    return
  }

  // Solicitar permiso de geolocalización
  navigator.geolocation.getCurrentPosition(
    () => {
      // Si se obtiene la ubicación, iniciar el seguimiento
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }

      const success = (position) => {
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude
        
        const distance = calculateDistance(
          userLat, userLng,
          schoolLocation.lat, schoolLocation.lng
        )
        
        isWithinSchoolZone.value = distance <= 4000
        
        locationStatus.value = isWithinSchoolZone.value
          ? `Estás dentro del área de recogida (${Math.round(distance)} m)`
          : `Estás fuera del área de recogida (${Math.round(distance)} m)`
      }

      const error = (err) => {
        console.error("Error getting location:", err)
        switch(err.code) {
          case err.PERMISSION_DENIED:
            locationStatus.value = "Se ha denegado el permiso de geolocalización"
            break
          case err.POSITION_UNAVAILABLE:
            locationStatus.value = "No se pudo obtener la ubicación"
            break
          case err.TIMEOUT:
            locationStatus.value = "La solicitud de ubicación ha expirado"
            break
          default:
            locationStatus.value = "Error desconocido al obtener la ubicación"
        }
      }

      watchId.value = navigator.geolocation.watchPosition(success, error, options)
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        locationStatus.value = "Por favor habilita la geolocalización en tu navegador para usar esta función"
      } else {
        locationStatus.value = "Error al obtener la ubicación"
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

onMounted(() => {
  checkGeolocation()
})

onUnmounted(() => {
  if (watchId.value !== null) {
    navigator.geolocation.clearWatch(watchId.value)
  }
})

defineExpose({
  isWithinSchoolZone
})
</script>

<style>
.map-container {
  height: 300px;
  background-color: #e5e7eb;
  border-radius: 0.75rem;
  position: relative;
  overflow: hidden;
}

.map-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6b7280;
}

/* Dark mode styles */
.dark .map-container {
  background-color: #374151;
}

.dark .map-placeholder {
  color: #9ca3af;
}
</style> 