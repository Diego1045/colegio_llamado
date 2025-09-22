import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginForm from '../components/LoginForm.vue'
import { useSEO } from '../composables/useSEO'

// Obtener el entorno de la aplicación desde las variables de entorno
const APP_ENV = import.meta.env.VITE_APP_ENV || 'production'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: false,
      title: 'Colegio Llamado - Sistema de Gestión de Salida Escolar',
      description: 'Sistema seguro de gestión de llamado y salida de estudiantes para colegios. Utiliza geolocalización y autenticación para garantizar la seguridad de los alumnos.',
      seoPage: 'home'
    }
  },
  {
    path: '/register',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: {
      title: 'Iniciar Sesión - Colegio Llamado',
      description: 'Accede de forma segura al sistema de gestión de salida escolar. Autenticación con geolocalización para padres y administradores.',
      seoPage: 'login'
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: {
      requiresAuth: false,
      title: 'Restablecer Contraseña - Colegio Llamado',
      description: 'Restablece tu contraseña de forma segura para acceder al sistema de gestión escolar.'
    }
  },
  {
    path: '/director',
    name: 'Director',
    component: () => import('../views/Director.vue'),
    meta: {
      requiresAuth: true,
      role: 'admin',
      title: 'Panel Director - Colegio Llamado',
      description: 'Panel administrativo para directores. Supervisa y gestiona todas las solicitudes de salida de estudiantes.',
      seoPage: 'director'
    }
  },
  {
    path: '/padres',
    name: 'Padres',
    component: () => import('../views/Padres.vue'),
    meta: {
      requiresAuth: true,
      role: 'admin',
      title: 'Gestión de Padres - Colegio Llamado',
      description: 'Administra y gestiona la información de los padres de familia en el sistema escolar.'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'Panel de Control - Colegio Llamado',
      description: 'Panel de control del sistema de gestión escolar. Monitorea y gestiona la salida de estudiantes de forma segura.',
      seoPage: 'dashboard'
    }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../views/Perfil.vue'),
    meta: {
      requiresAuth: true,
      title: 'Mi Perfil - Colegio Llamado',
      description: 'Gestiona tu información personal y configuración de cuenta en el sistema escolar.'
    }
  },
  {
    path: '/estudiantes',
    name: 'Estudiantes',
    component: () => import('../views/Estudiantes.vue'),
    meta: {
      requiresAuth: true,
      role: 'padre',
      title: 'Mis Estudiantes - Colegio Llamado',
      description: 'Gestiona y solicita la salida de tus hijos del colegio de forma segura con verificación de ubicación.',
      seoPage: 'estudiantes'
    }
  },
  {
    path: '/registros',
    name: 'Registros',
    component: () => import('../views/Registros.vue'),
    meta: {
      requiresAuth: true,
      title: 'Registros de Salida - Colegio Llamado',
      description: 'Consulta el historial de registros de salida de estudiantes del colegio.'
    }
  },
  {
    path: '/anuncios',
    name: 'Anuncios',
    component: () => import('../views/Anuncios.vue'),
    meta: {
      requiresAuth: true,
      role: 'admin',
      title: 'Anuncios - Colegio Llamado',
      description: 'Gestiona y publica anuncios importantes para la comunidad educativa.'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Inicializar la autenticación si no se ha hecho
  if (!authStore.user) {
    await authStore.initialize()
  }

  // Actualizar meta tags SEO
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  if (to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }

  console.log('Ruta:', to.path)
  console.log('Usuario:', authStore.user)
  console.log('Rol en metadata:', authStore.user?.user_metadata?.role)
  console.log('Rol en app metadata:', authStore.user?.app_metadata?.role)
  console.log('Requiere Auth:', to.meta.requiresAuth)
  console.log('Rol requerido:', to.meta.role)
  console.log('Entorno de la aplicación:', APP_ENV)

  // En entorno local, permitir acceso a todas las rutas sin restricciones
  if (APP_ENV === 'local') {
    console.log('Entorno local: Permitiendo acceso a todas las rutas')
    next()
    return
  }

  // Verificar si el usuario está autenticado cuando la ruta lo requiere
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Verificar rol del usuario
  if (authStore.user && to.meta.role) {
    try {
      const userRole = authStore.user.role
      
      // Verificar si el rol del usuario coincide con el requerido por la ruta
      if (userRole === to.meta.role) {
        next()
        return
      }
      
      // Para rutas que requieren admin o docente (como anuncios)
      if (to.meta.role === 'admin' && to.path === '/anuncios') {
        if (userRole === 'admin' || userRole === 'docente') {
          next()
            return
          }
        }
        
        // Si no tiene el rol necesario, redirigir al dashboard
        console.log(`Usuario con rol '${data.role}' no tiene acceso a ruta que requiere '${to.meta.role}'`)
        next('/dashboard')
        return
      } else {
        console.error('Error al verificar rol desde BD:', error)
        // Si hay error obteniendo el rol, redirigir al dashboard por seguridad
        next('/dashboard')
        return
      }
    } catch (err) {
      console.error('Error al verificar rol:', err)
      next('/dashboard')
      return
    }
  }

  // Para rutas sin requisito específico de rol pero que requieren autenticación
  if (to.meta.requiresAuth && authStore.isAuthenticated) {
    next()
    return
  }

  // Si todo está bien, permitir acceso
  next()
})

export default router
