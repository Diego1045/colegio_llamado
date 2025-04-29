<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div v-if="!isLogin">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
      </button>
    </form>

    <div class="mt-4 text-center">
      <button
        @click="toggleMode"
        class="text-sm text-indigo-600 hover:text-indigo-500"
      >
        {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
      </button>
    </div>

    <div v-if="isLogin" class="mt-4 text-center">
      <button
        @click="handleResetPassword"
        class="text-sm text-indigo-600 hover:text-indigo-500"
      >
        ¿Olvidaste tu contraseña?
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../supabase'

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleSubmit = async () => {
  try {
    if (!isLogin.value && password.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden'
      return
    }

    if (isLogin.value) {
      const { error: signInError } = await auth.signIn(email.value, password.value)
      if (signInError) throw signInError
    } else {
      const { error: signUpError } = await auth.signUp(email.value, password.value)
      if (signUpError) throw signUpError
    }
  } catch (err) {
    error.value = err.message
  }
}

const handleResetPassword = async () => {
  try {
    if (!email.value) {
      error.value = 'Por favor ingresa tu email'
      return
    }
    const { error: resetError } = await auth.resetPassword(email.value)
    if (resetError) throw resetError
    error.value = 'Se ha enviado un enlace para restablecer tu contraseña'
  } catch (err) {
    error.value = err.message
  }
}
</script> 