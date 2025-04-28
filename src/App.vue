<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faSchool, faHome, faSignInAlt, faUserPlus, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSun, faMoon, faSchool, faHome, faSignInAlt, faUserPlus, faUserShield)

export default {
  name: 'App',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      isDark: false
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark')
    }
  },
  mounted() {
    // Check for saved theme preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      this.isDark = true
    } else {
      document.documentElement.classList.remove('dark')
      this.isDark = false
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Theme Toggle -->
    <div class="fixed top-4 right-4">
      <button @click="toggleTheme" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <i class="fas fa-sun text-yellow-500 dark:hidden"></i>
        <i class="fas fa-moon text-blue-300 hidden dark:block"></i>
      </button>
    </div>

    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <i class="fas fa-school text-3xl"></i>
            <h1 class="text-2xl font-bold">Colegio Albert Einstein</h1>
          </div>
          <nav class="flex space-x-4">
            <router-link to="/" class="text-white hover:text-blue-200 transition">
              <i class="fas fa-home mr-2"></i>Inicio
            </router-link>
            <router-link to="/login" class="text-white hover:text-blue-200 transition">
              <i class="fas fa-sign-in-alt mr-2"></i>Login
            </router-link>
            <router-link to="/register" class="text-white hover:text-blue-200 transition">
              <i class="fas fa-user-plus mr-2"></i>Registro
            </router-link>
            <router-link to="/director" class="text-white hover:text-blue-200 transition">
              <i class="fas fa-user-shield mr-2"></i>Directora
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view/>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
        <p>© 2023 Colegio Albert Einstein. Todos los derechos reservados.</p>
        <p class="mt-2 text-sm">Sistema de salida escolar seguro</p>
      </div>
    </footer>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
