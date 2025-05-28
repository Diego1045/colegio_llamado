<template>
  <div class="min-h-screen bg-gray-50">
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
          <div class="flex items-center space-x-4">
            <div class="flex space-x-4">
              <router-link to="/login" class="text-white hover:text-blue-200 transition">
                Iniciar Sesión
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <section class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Bienvenido al Sistema de Salida Escolar Seguro</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Un sistema innovador diseñado para garantizar la seguridad y tranquilidad en la salida de los estudiantes.
        </p>
      </section>

      <!-- Features Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div class="text-center mb-4">
            <i class="fas fa-shield-alt text-4xl text-blue-500"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Seguridad Garantizada</h3>
          <p class="text-gray-600">
            Sistema de verificación de identidad para asegurar que los estudiantes solo sean recogidos por personas autorizadas.
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div class="text-center mb-4">
            <i class="fas fa-clock text-4xl text-blue-500"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Control de Tiempo</h3>
          <p class="text-gray-600">
            Registro preciso de la hora de salida y notificaciones automáticas a los padres de familia.
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div class="text-center mb-4">
            <i class="fas fa-chart-line text-4xl text-blue-500"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Reportes Detallados</h3>
          <p class="text-gray-600">
            Acceso a reportes y estadísticas sobre la asistencia y salida de los estudiantes.
          </p>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">¿Listo para comenzar?</h2>
        <p class="text-xl text-gray-600 mb-8">
          Regístrate ahora y mantén un control seguro sobre la salida de tus hijos.
        </p>
        <div class="mt-8">
          <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 inline-block">
            Iniciar Sesión
          </router-link>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Lo que dicen nuestros usuarios</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <i class="fas fa-user text-blue-500"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">María González</h4>
                <p class="text-gray-600">Madre de familia</p>
              </div>
            </div>
            <p class="text-gray-600">
              "Este sistema me ha dado mucha tranquilidad. Ahora puedo estar segura de que mi hijo está en buenas manos."
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <i class="fas fa-user text-blue-500"></i>
              </div>
              <div>
                <h4 class="font-bold text-gray-800">Carlos Rodríguez</h4>
                <p class="text-gray-600">Padre de familia</p>
              </div>
            </div>
            <p class="text-gray-600">
              "La facilidad de uso y la seguridad que proporciona este sistema es impresionante. Totalmente recomendado."
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 border-t border-gray-200 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-600">
        <p>© 2023 Colegio Albert Einstein. Todos los derechos reservados.</p>
        <p class="mt-2 text-sm">Sistema de salida escolar seguro</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    toggleTheme() {
      document.documentElement.classList.toggle('dark')
    }
  }
}
</script>

<style>
.dark {
  color-scheme: dark;
}
.dark body {
  background-color: #1a1a1a;
  color: #FFFFFF;
}
.dark .bg-white {
  background-color: #2d2d2d;
}
.dark .text-gray-800 {
  color: #FFFFFF;
}
.dark .border-gray-200 {
  border-color: #404040;
}
.dark .bg-gray-50 {
  background-color: #333333;
}
.dark .text-gray-500 {
  color: #FFFFFF;
}
.dark .text-gray-600 {
  color: #FFFFFF;
}
.dark .bg-gray-100 {
  background-color: #404040;
}
.dark .hover\:bg-gray-100:hover {
  background-color: #4d4d4d;
}
</style>
