import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

// Importar Vue Toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Obtener el entorno de la aplicación
const APP_ENV = import.meta.env.VITE_APP_ENV || 'production'
const APP_NAME = import.meta.env.VITE_APP_NAME || 'Colegio Llamado'

console.log(`Iniciando aplicación: ${APP_NAME}`)
console.log(`Entorno: ${APP_ENV}`)

// Configuración específica para entorno local
if (APP_ENV === 'local') {
    console.log('Modo de desarrollo local activado - Acceso sin restricciones a todas las rutas')
    console.log('Nota: Aunque estamos en modo local, la aplicación sigue conectándose a Supabase para operaciones de datos')
}

const app = createApp(App)
const pinia = createPinia()

// Opciones para Toast
const toastOptions = {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
}

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(pinia)
app.use(Toast, toastOptions)

// Inicializar el store de autenticación
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
