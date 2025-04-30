<template>
  <div class="mt-6 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <i class="fas fa-clock text-yellow-400"></i>
      </div>
      <div class="ml-3">
        <p class="text-sm text-yellow-700 dark:text-yellow-300">
          Horario de salida: <span class="font-medium">{{ scheduleTime }}</span><br>
          {{ scheduleMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const scheduleTime = ref('12:20 PM - 1:20 PM')
const scheduleMessage = ref('Solo puedes llamar a tus hijos durante este horario.')

// Aquí podrías agregar más funcionalidades como:
// - Verificar si el usuario está dentro del horario permitido
// - Mostrar diferentes mensajes según el estado del horario
// - Integrar con una API para obtener el horario dinámicamente
</script> 