<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faSchool, faHome, faSignInAlt, faUserPlus, faUserShield, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuthStore } from './stores/auth'

library.add(faSun, faMoon, faSchool, faHome, faSignInAlt, faUserPlus, faUserShield, faSignOutAlt)

export default {
  name: 'App',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      isDark: false,
      authStore: useAuthStore()
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark')
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },
    async handleSignOut() {
      await this.authStore.signOut()
      this.$router.push('/login')
    }
  },
  mounted() {
    // Inicializar la autenticación
    this.authStore.initialize()
    
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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Theme Toggle -->
    <div class="fixed top-4 right-4 z-50">
      <button @click="toggleTheme" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-all duration-200">
        <font-awesome-icon :icon="['fas', 'sun']" class="text-yellow-500 dark:hidden text-xl" />
        <font-awesome-icon :icon="['fas', 'moon']" class="text-blue-300 hidden dark:block text-xl" />
      </button>
    </div>

    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <font-awesome-icon :icon="['fas', 'school']" class="text-3xl" />
            <h1 class="text-2xl font-bold">Colegio Albert Einstein</h1>
          </div>
          <nav class="flex space-x-2 md:space-x-4">
            <!-- <router-link to="/" class="nav-link">
              <font-awesome-icon :icon="['fas', 'home']" class="mr-2" />Inicio
            </router-link> -->
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="nav-link">
                <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2" />Login
              </router-link>
              <router-link to="/register" class="nav-link">
                <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />Registro
              </router-link>
            </template>
            <template v-else>
              <router-link to="/dashboard" class="nav-link">
                <font-awesome-icon :icon="['fas', 'home']" class="mr-2" />Dashboard
              </router-link>
              <router-link to="/director" class="nav-link" v-if="authStore.isAdmin">
                <font-awesome-icon :icon="['fas', 'user-shield']" class="mr-2" />Directora
              </router-link>
              <button @click="handleSignOut" class="nav-link">
                <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-2" />Salir
              </button>
            </template>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto">
      <div class="w-full max-w-4xl mx-auto">
        <router-view/>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <p>© 2023 Colegio Albert Einstein. Todos los derechos reservados.</p>
        <p class="mt-2 text-sm">Sistema de salida escolar seguro</p>
      </div>
    </footer>
  </div>
</template>

<style>
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  text-decoration: none;
  font-size: 1rem;
}

.nav-link:hover, .nav-link.router-link-exact-active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  header {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .nav-link {
    font-size: 0.95rem;
    padding: 0.4rem 0.7rem;
  }
}
</style>
