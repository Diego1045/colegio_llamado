<template>
  <div class="login">
    <h1>Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
      </button>
      <div class="links">
        <router-link to="/reset-password">¿Olvidaste tu contraseña?</router-link>
        <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = computed(() => authStore.getError)
const loading = computed(() => authStore.isLoading)

// Verificar si el usuario ya está autenticado al montar el componente
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})

const handleLogin = async () => {
  try {
    await authStore.signIn(email.value, password.value)
    if (authStore.isAuthenticated) {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Error en el login:', err)
  }
}
</script>

<style scoped>
.login {
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

.links {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
