<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div class="container mx-auto px-6">
        <div class="text-center">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
              <i class="fas fa-shield-alt text-3xl text-white"></i>
    </div>
            <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Sistema de Llamado Escolar
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Una solución tecnológica innovadora que garantiza la seguridad de nuestros estudiantes 
              mediante geolocalización y autenticación verificada para padres de familia.
            </p>
          </div>
          <div class="mt-8">
            <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block mr-4">
                Iniciar Sesión
              </router-link>
            <button @click="scrollToSection('problema')" class="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-bold py-3 px-8 rounded-lg transition duration-300">
              Conocer Más
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Problema Section -->
    <section id="problema" class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Cuál es el Problema?
          </h2>
          <div class="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl mb-6">
                <h3 class="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
                  Problemas Actuales en Colegios
                </h3>
                <ul class="space-y-3 text-gray-700 dark:text-gray-300">
                  <li class="flex items-start">
                    <i class="fas fa-exclamation-triangle text-red-500 mr-3 mt-1"></i>
                    <span><strong>Seguridad Comprometida:</strong> Personas no autorizadas pueden recoger estudiantes</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-clock text-red-500 mr-3 mt-1"></i>
                    <span><strong>Falta de Control:</strong> No hay registro de quién recoge a cada estudiante</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-users text-red-500 mr-3 mt-1"></i>
                    <span><strong>Caos Organizacional:</strong> Aglomeraciones y desorden en la salida</span>
                  </li>
                  <li class="flex items-start">
                    <i class="fas fa-phone-slash text-red-500 mr-3 mt-1"></i>
                    <span><strong>Comunicación Deficiente:</strong> Los padres no saben cuándo llegará su hijo</span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl">
                <div class="text-center">
                  <i class="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
                  <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    ⚠️ Peligros Reales de Seguridad Escolar
                  </h4>
                  <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="bg-white dark:bg-gray-600 p-4 rounded-lg border-l-4 border-red-500">
                      <div class="text-3xl font-bold text-red-600">73%</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300 font-semibold">DE COLEGIOS SIN CONTROL DE ACCESO</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">*Solo 27% controla quién recoge estudiantes</div>
                    </div>
                    <div class="bg-white dark:bg-gray-600 p-4 rounded-lg border-l-4 border-orange-500">
                      <div class="text-3xl font-bold text-orange-600">89%</div>
                      <div class="text-sm text-gray-600 dark:text-gray-300 font-semibold">SIN SISTEMAS DE VERIFICACIÓN</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">*No verifican identidad de quién recoge niños</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

    <!-- Solución Section -->
    <section id="solucion" class="py-20 bg-blue-50 dark:bg-gray-900">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestra Solución
          </h2>
          <div class="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Un sistema integral que combina tecnología de geolocalización con autenticación segura 
            para revolucionar la forma en que los colegios manejan la salida de estudiantes.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div class="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-map-marker-alt text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Geolocalización</h3>
            <p class="text-gray-600 dark:text-gray-300">Verificamos que el padre esté físicamente en el colegio</p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div class="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-user-shield text-2xl text-green-600"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Autenticación</h3>
            <p class="text-gray-600 dark:text-gray-300">Solo padres registrados pueden llamar a sus hijos</p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div class="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-bell text-2xl text-purple-600"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Notificaciones</h3>
            <p class="text-gray-600 dark:text-gray-300">Alertas en tiempo real sobre el estado del llamado</p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div class="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-chart-line text-2xl text-orange-600"></i>
        </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Reportes</h3>
            <p class="text-gray-600 dark:text-gray-300">Estadísticas completas para la administración</p>
          </div>
        </div>
        </div>
      </section>

    <!-- Cómo Funciona Section -->
    <section id="como-funciona" class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Cómo Funciona?
          </h2>
          <div class="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Paso 1 -->
            <div class="text-center">
              <div class="bg-blue-100 dark:bg-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Registro y Verificación</h3>
              <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <i class="fas fa-user-plus text-3xl text-blue-600 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-300">
                  Los padres se registran en el sistema con sus datos y los de sus hijos. 
                  El colegio verifica y aprueba cada registro.
                </p>
              </div>
            </div>
            <!-- Paso 2 -->
            <div class="text-center">
              <div class="bg-green-100 dark:bg-green-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Llegada al Colegio</h3>
              <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <i class="fas fa-map-marker-alt text-3xl text-green-600 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-300">
                  El padre llega al colegio y su ubicación es verificada automáticamente 
                  mediante GPS para confirmar su presencia física.
                </p>
              </div>
            </div>
            <!-- Paso 3 -->
            <div class="text-center">
              <div class="bg-purple-100 dark:bg-purple-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Llamado Seguro</h3>
              <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <i class="fas fa-phone text-3xl text-purple-600 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-300">
                  Una vez verificada la ubicación, el padre puede llamar a su hijo 
                  desde la aplicación. El estudiante es notificado para ir a la salida.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Diagrama de flujo -->
          <div class="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-xl">
            <h4 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Flujo del Sistema</h4>
            <div class="flex justify-center items-center space-x-4 overflow-x-auto">
              <div class="flex-shrink-0 text-center">
                <div class="bg-blue-600 text-white p-4 rounded-lg mb-2">
                  <i class="fas fa-user-check text-2xl"></i>
                </div>
                <p class="text-sm font-medium">Login</p>
              </div>
              <i class="fas fa-arrow-right text-gray-400"></i>
              <div class="flex-shrink-0 text-center">
                <div class="bg-green-600 text-white p-4 rounded-lg mb-2">
                  <i class="fas fa-location-arrow text-2xl"></i>
                </div>
                <p class="text-sm font-medium">Verificar GPS</p>
              </div>
              <i class="fas fa-arrow-right text-gray-400"></i>
              <div class="flex-shrink-0 text-center">
                <div class="bg-purple-600 text-white p-4 rounded-lg mb-2">
                  <i class="fas fa-phone text-2xl"></i>
                </div>
                <p class="text-sm font-medium">Llamar Hijo</p>
              </div>
              <i class="fas fa-arrow-right text-gray-400"></i>
              <div class="flex-shrink-0 text-center">
                <div class="bg-orange-600 text-white p-4 rounded-lg mb-2">
                  <i class="fas fa-child text-2xl"></i>
                </div>
                <p class="text-sm font-medium">Estudiante Sale</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios Section -->
    <section class="py-16 -mx-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">Beneficios del Sistema</h2>
          <div class="w-24 h-1 bg-white mx-auto mb-8"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="text-center">
            <i class="fas fa-shield-alt text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Máxima Seguridad</h3>
            <p>100% de control sobre quién puede recoger a cada estudiante</p>
          </div>
          <div class="text-center">
            <i class="fas fa-clock text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Ahorro de Tiempo</h3>
            <p>Proceso de salida más rápido y organizado</p>
          </div>
          <div class="text-center">
            <i class="fas fa-heart text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Tranquilidad</h3>
            <p>Padres y colegio con total confianza en el proceso</p>
          </div>
          <div class="text-center">
            <i class="fas fa-mobile-alt text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Fácil de Usar</h3>
            <p>Interfaz intuitiva accesible desde cualquier dispositivo</p>
          </div>
          <div class="text-center">
            <i class="fas fa-chart-bar text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Control Total</h3>
            <p>Reportes detallados y estadísticas en tiempo real</p>
          </div>
          <div class="text-center">
            <i class="fas fa-leaf text-4xl mb-4"></i>
            <h3 class="text-xl font-bold mb-2">Eco-Friendly</h3>
            <p>Reduce el uso de papel y procesos manuales</p>
          </div>
          </div>
        </div>
      </section>

    <!-- CTA Final -->
    <section class="py-16 -mx-4 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          ¿Listo para Transformar la Seguridad de tu Colegio?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Únete a la revolución de la seguridad escolar con nuestro sistema de llamado inteligente.
        </p>
        <div class="space-x-4">
          <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 inline-block">
            Comenzar Ahora
          </router-link>
          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-lg transition duration-300">
            Solicitar Demo
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>
