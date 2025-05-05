import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase'
import LoginForm from '../components/LoginForm.vue'

// Obtener el entorno de la aplicación desde las variables de entorno
const APP_ENV = import.meta.env.VITE_APP_ENV || 'production'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/director',
    name: 'Director',
    component: () => import('../views/Director.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/padres',
    name: 'Padres',
    component: () => import('../views/Padres.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../views/Perfil.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/estudiantes',
    name: 'Estudiantes',
    component: () => import('../views/Estudiantes.vue'),
    meta: { requiresAuth: true, role: 'padre' }
  },
  {
    path: '/registros',
    name: 'Registros',
    component: () => import('../views/Registros.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/anuncios',
    name: 'Anuncios',
    component: () => import('../views/Anuncios.vue'),
    meta: { requiresAuth: true, role: 'admin' }
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

  // Obtener el rol del usuario desde la tabla users
  if (authStore.user && to.meta.role) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', authStore.user.id)
        .single()

      if (!error && data && data.role === to.meta.role) {
        // Si el rol en la base de datos coincide con el requerido, permitir acceso
        next()
        return
      } else if (to.path === '/padres') {
        // Para la ruta /padres, verificar si es admin en la tabla users
        if (!error && data && data.role === 'admin') {
          next()
          return
        }
      }
    } catch (err) {
      console.error('Error al verificar rol:', err)
    }
  }

  // Para la ruta /padres, permitir acceso temporal para depuración
  if (to.path === '/padres' && process.env.NODE_ENV === 'development') {
    next()
    return
  }

  // Para rutas con requisito de rol donde el rol no coincide
  if (to.meta.role && to.meta.role !== authStore.user?.user_metadata?.role) {
    next('/dashboard')
    return
  }

  // Si todo está bien, permitir acceso
  next()
})

export default router
