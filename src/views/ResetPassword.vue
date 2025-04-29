<template>
  <div class="reset-password">
    <h1>Recuperar Contraseña</h1>
    <form @submit.prevent="handleResetPassword">
      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="success" class="success-message">
        Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Enviar enlace' }}
      </button>
      <div class="links">
        <router-link to="/login">Volver al inicio de sesión</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const email = ref('')
const success = ref(false)
const error = computed(() => authStore.getError)
const loading = computed(() => authStore.isLoading)

const handleResetPassword = async () => {
  try {
    await authStore.resetPassword(email.value)
    success.value = true
  } catch (err) {
    console.error('Error al enviar el enlace:', err)
  }
}
</script>

<style scoped>
.reset-password {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  margin-bottom: 10px;
  text-align: center;
}

.success-message {
  color: #42b983;
  margin-bottom: 10px;
  text-align: center;
}

.links {
  margin-top: 20px;
  text-align: center;
}

.links a {
  color: #42b983;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style> 