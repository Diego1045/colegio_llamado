<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Botón de tema oscuro -->
    <div class="fixed top-4 right-4">
      <button @click="toggleTheme" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <i class="fas fa-sun text-yellow-500 dark:hidden"></i>
        <i class="fas fa-moon text-blue-300 hidden dark:block"></i>
      </button>
    </div>

    <!-- Header específico para Director -->
    <header class="bg-purple-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <i class="fas fa-user-shield text-3xl"></i>
            <h1 class="text-2xl font-bold">Panel de Directora</h1>
          </div>
          <router-link to="/" class="text-white hover:text-purple-200 transition">
            <i class="fas fa-arrow-left mr-2"></i>Volver al inicio
          </router-link>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-8">
      <!-- Sección de Login -->
      <section v-if="!isLoggedIn" class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-8">
        <div class="text-center mb-6">
          <i class="fas fa-lock text-5xl text-purple-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Acceso Directora</h2>
          <p class="text-gray-600 dark:text-gray-300 mt-2">Ingresa tus credenciales para acceder al panel</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="directorEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
            <input type="email" id="directorEmail" v-model="loginData.email" required 
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white">
          </div>
          <div>
            <label for="directorPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
            <input type="password" id="directorPassword" v-model="loginData.password" required 
                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white">
          </div>
          <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
            Iniciar Sesión
          </button>
        </form>
      </section>

      <!-- Dashboard (visible solo cuando está logueada) -->
      <section v-else class="space-y-8">
        <!-- Generador de códigos -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Generador de Códigos de Invitación</h2>
          <div class="space-y-6">
            <div class="flex items-center space-x-4">
              <input type="number" v-model="codeQuantity" min="1" max="10" 
                     class="w-20 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white">
              <button @click="handleGenerateCodes" class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                <i class="fas fa-key mr-2"></i>Generar Códigos
              </button>
            </div>
            <div v-if="generatedCodes.length > 0" class="space-y-4">
              <div v-for="code in generatedCodes" :key="code" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span class="font-mono text-lg dark:text-white">{{ code }}</span>
                <button @click="copyCode(code)" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de códigos -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Códigos Generados</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Código</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha de Generación</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="code in allCodes" :key="code.code">
                  <td class="px-6 py-4 whitespace-nowrap font-mono dark:text-white">{{ code.code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(code.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ code.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ formatDate(code.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Cuentas de padres -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Cuentas de Padres</h2>
            <div class="relative">
              <input type="text" v-model="searchQuery" 
                     class="w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                     placeholder="Buscar por nombre, correo o hijo...">
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Correo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hijos Registrados</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="parent in filteredParents" :key="parent.email">
                  <td class="px-6 py-4 whitespace-nowrap dark:text-white">{{ parent.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap dark:text-white">{{ parent.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="space-y-1">
                      <div v-for="child in parent.children" :key="child.name" class="text-sm text-gray-600 dark:text-gray-300">
                        {{ child.name }} - {{ child.grade }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button @click="deleteParent(parent.email)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium">
                      <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
        <p>© 2023 Colegio Albert Einstein. Todos los derechos reservados.</p>
        <p class="mt-2 text-sm">Panel de Administración - Uso exclusivo de la directora</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'DirectorView',
  data() {
    return {
      isLoggedIn: false,
      loginData: {
        email: '',
        password: ''
      },
      codeQuantity: 1,
      generatedCodes: [],
      allCodes: [],
      searchQuery: '',
      parents: []
    }
  },
  computed: {
    filteredParents() {
      if (!this.searchQuery) return this.parents;
      const query = this.searchQuery.toLowerCase();
      return this.parents.filter(parent => {
        return parent.name.toLowerCase().includes(query) ||
               parent.email.toLowerCase().includes(query) ||
               parent.children.some(child => child.name.toLowerCase().includes(query));
      });
    }
  },
  methods: {
    toggleTheme() {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    },
    handleLogin() {
      if (this.loginData.email === 't@gmail.com' && this.loginData.password === 'u') {
        this.isLoggedIn = true;
        localStorage.setItem('isAuthenticated', 'true');
        this.loadExistingCodes();
        this.loadParentsAccounts();
      } else {
        alert('Credenciales incorrectas. Por favor, intente nuevamente.');
      }
    },
    generateNewCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code += '-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    handleGenerateCodes() {
      this.generatedCodes = [];
      for (let i = 0; i < this.codeQuantity; i++) {
        const code = this.generateNewCode();
        this.generatedCodes.push(code);
        this.saveCodeToStorage(code);
      }
      this.loadExistingCodes();
    },
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        alert('Código copiado al portapapeles');
      });
    },
    saveCodeToStorage(code) {
      try {
        const codes = JSON.parse(localStorage.getItem('invitationCodes') || '[]');
        const codeExists = codes.some(codeData => codeData.code === code);
        if (!codeExists) {
          codes.push({
            code,
            status: 'Disponible',
            date: new Date().toISOString()
          });
          localStorage.setItem('invitationCodes', JSON.stringify(codes));
        }
      } catch (error) {
        console.error('Error al guardar el código:', error);
      }
    },
    loadExistingCodes() {
      try {
        this.allCodes = JSON.parse(localStorage.getItem('invitationCodes') || '[]');
      } catch (error) {
        console.error('Error al cargar los códigos:', error);
      }
    },
    loadParentsAccounts() {
      try {
        this.parents = JSON.parse(localStorage.getItem('registeredParents') || '[]');
      } catch (error) {
        console.error('Error al cargar las cuentas de padres:', error);
      }
    },
    deleteParent(email) {
      if (confirm('¿Estás segura de que deseas eliminar esta cuenta? Esta acción no se puede deshacer.')) {
        const parents = JSON.parse(localStorage.getItem('registeredParents') || '[]');
        const updatedParents = parents.filter(parent => parent.email !== email);
        localStorage.setItem('registeredParents', JSON.stringify(updatedParents));
        this.loadParentsAccounts();
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 'Disponible':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Usado':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'No válido':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    }
  },
  mounted() {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // Verificar autenticación
    this.isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
    if (this.isLoggedIn) {
      this.loadExistingCodes();
      this.loadParentsAccounts();
    }
  }
}
</script>

<style>
/* Estilos específicos para el modo oscuro */
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
.dark .bg-gray-100 {
  background-color: #404040;
}
.dark .hover\:bg-gray-100:hover {
  background-color: #4d4d4d;
}
.dark .bg-purple-600 {
  background-color: #7c3aed;
}
.dark .hover\:bg-purple-700:hover {
  background-color: #6d28d9;
}
.dark .bg-green-100 {
  background-color: #064e3b;
}
.dark .text-green-800 {
  color: #6ee7b7;
}
.dark table {
  border-color: #404040;
}
.dark th {
  background-color: #333333;
  color: #f3f4f6;
}
.dark td {
  border-color: #404040;
}
.dark .text-red-600 {
  color: #f87171;
}
.dark .hover\:text-red-900:hover {
  color: #ef4444;
}
.dark .text-gray-600 {
  color: #FFFFFF;
}
</style>
