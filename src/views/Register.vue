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
          <router-link to="/" class="text-white hover:text-blue-200 transition">
            <i class="fas fa-arrow-left mr-2"></i>Volver al inicio
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Invitation Code Section -->
      <section v-if="!showRegistrationForm" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div class="text-center mb-6">
          <i class="fas fa-envelope text-5xl text-blue-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800">Registro por Invitación</h2>
          <p class="text-gray-600 mt-2">Ingresa el código de invitación que recibiste por correo electrónico</p>
        </div>
        <form @submit.prevent="handleInvitationCode" class="space-y-6">
          <div>
            <label for="invitationCode" class="block text-sm font-medium text-gray-700 mb-1">Código de Invitación</label>
            <input type="text" id="invitationCode" v-model="invitationCode" required 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Ej: ABC123-XYZ456">
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
            Verificar Código
          </button>
        </form>
        <div class="mt-6 text-center space-y-4">
          <div class="text-sm text-gray-600">
            <p>¿No recibiste tu código de invitación?</p>
            <a href="#" class="text-blue-600 hover:underline">Contacta al colegio</a>
          </div>
        </div>
      </section>

      <!-- Registration Form -->
      <section v-if="showRegistrationForm" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div class="text-center mb-6">
          <i class="fas fa-user-plus text-5xl text-blue-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800">Completa tu Registro</h2>
          <p class="text-gray-600 mt-2">Por favor, completa la siguiente información</p>
        </div>
        <form @submit.prevent="handleRegistration" class="space-y-6">
          <div>
            <label for="regName" class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input type="text" id="regName" v-model="registrationData.name" required 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label for="regEmail" class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input type="email" id="regEmail" v-model="registrationData.email" required 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label for="regPassword" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" id="regPassword" v-model="registrationData.password" required 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label for="regConfirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input type="password" id="regConfirmPassword" v-model="registrationData.confirmPassword" required 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="space-y-4">
            <div v-for="(child, index) in registrationData.children" :key="index" class="child-field border p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-800 mb-3">Hijo/a #{{ index + 1 }}</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input type="text" v-model="child.name" required 
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Grado</label>
                  <select v-model="child.grade" required 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecciona un grado</option>
                    <option value="Prejardín">Prejardín</option>
                    <option value="Preescolar">Preescolar</option>
                    <option value="1°">1°</option>
                    <option value="2°">2°</option>
                    <option value="3°">3°</option>
                    <option value="4°">4°</option>
                    <option value="5°">5°</option>
                    <option value="6°">6°</option>
                    <option value="7°">7°</option>
                    <option value="8°">8°</option>
                    <option value="9°">9°</option>
                    <option value="10°">10°</option>
                    <option value="11°">11°</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <button type="button" @click="addChild" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300">
            <i class="fas fa-plus mr-2"></i> Agregar Otro Hijo/a
          </button>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
            Completar Registro
          </button>
        </form>
      </section>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="max-w-md mx-auto bg-green-50 border-l-4 border-green-400 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-400"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">
              ¡Registro completado con éxito! Serás redirigido a la página de inicio de sesión.
            </p>
          </div>
        </div>
      </div>
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
  name: 'RegisterView',
  data() {
    return {
      invitationCode: '',
      showRegistrationForm: false,
      showSuccessMessage: false,
      registrationData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        children: [
          {
            name: '',
            grade: ''
          }
        ]
      }
    }
  },
  methods: {
    toggleTheme() {
      document.documentElement.classList.toggle('dark')
    },
    async handleInvitationCode() {
      try {
        const storedCodes = localStorage.getItem('invitationCodes')
        if (storedCodes) {
          const allCodes = JSON.parse(storedCodes)
          const validCode = allCodes.find(codeData => 
            codeData.code === this.invitationCode && 
            codeData.status === 'Disponible'
          )
          
          if (validCode) {
            this.showRegistrationForm = true
          } else {
            alert('Código de invitación inválido o ya utilizado')
          }
        } else {
          alert('No hay códigos de invitación disponibles')
        }
      } catch (error) {
        console.error('Error al verificar el código:', error)
        alert('Error al verificar el código de invitación')
      }
    },
    addChild() {
      this.registrationData.children.push({
        name: '',
        grade: ''
      })
    },
    async handleRegistration() {
      if (this.registrationData.password !== this.registrationData.confirmPassword) {
        alert('Las contraseñas no coinciden')
        return
      }

      try {
        // Guardar datos del usuario
        const userData = {
          name: this.registrationData.name,
          email: this.registrationData.email,
          password: this.registrationData.password,
          children: this.registrationData.children
        }

        // Guardar en localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        users.push(userData)
        localStorage.setItem('users', JSON.stringify(users))

        // Marcar código como usado
        const storedCodes = JSON.parse(localStorage.getItem('invitationCodes') || '[]')
        const updatedCodes = storedCodes.map(codeData => {
          if (codeData.code === this.invitationCode) {
            return { ...codeData, status: 'Usado' }
          }
          return codeData
        })
        localStorage.setItem('invitationCodes', JSON.stringify(updatedCodes))

        this.showSuccessMessage = true
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } catch (error) {
        console.error('Error al registrar usuario:', error)
        alert('Error al completar el registro')
      }
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
