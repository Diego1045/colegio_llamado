# Guía de Migración del Frontend Vue.js

Esta guía te ayudará a adaptar tu frontend Vue.js existente para usar el nuevo backend de Laravel en lugar de Supabase.

## 🔄 Cambios Principales

### 1. Reemplazar Cliente de Supabase

**Antes (Supabase):**
```javascript
// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Después (Laravel API):**
```javascript
// src/api.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para incluir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### 2. Actualizar Store de Autenticación

**Archivo: `src/stores/auth.js`**

```javascript
import { defineStore } from 'pinia'
import api from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: false,
    loading: false
  }),

  actions: {
    async initialize() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          await this.getCurrentUser()
        } catch (error) {
          this.logout()
        }
      }
    },

    async login(email, password) {
      this.loading = true
      try {
        const response = await api.post('/auth/login', { email, password })
        
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          this.isAuthenticated = true
          
          localStorage.setItem('auth_token', this.token)
          
          return { success: true, user: this.user }
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Error de autenticación'
        return { success: false, error: message }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const response = await api.post('/auth/register', userData)
        
        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          this.isAuthenticated = true
          
          localStorage.setItem('auth_token', this.token)
          
          return { success: true, user: this.user }
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Error en el registro'
        return { success: false, error: message }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('auth_token')
      }
    },

    async getCurrentUser() {
      try {
        const response = await api.get('/auth/me')
        if (response.data.success) {
          this.user = response.data.data.user
          this.isAuthenticated = true
          return this.user
        }
      } catch (error) {
        throw error
      }
    },

    async validateInvitationCode(codigo) {
      try {
        const response = await api.post('/auth/validate-code', { codigo })
        return response.data
      } catch (error) {
        return { success: false, error: 'Error validando código' }
      }
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isPadre: (state) => state.user?.role === 'padre',
    nombreCompleto: (state) => state.user ? `${state.user.nombre} ${state.user.apellido}` : ''
  }
})
```

### 3. Crear Store para Estudiantes

**Archivo: `src/stores/estudiantes.js`**

```javascript
import { defineStore } from 'pinia'
import api from '@/api'

export const useEstudiantesStore = defineStore('estudiantes', {
  state: () => ({
    estudiantes: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchEstudiantes() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/estudiantes')
        if (response.data.success) {
          this.estudiantes = response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando estudiantes'
      } finally {
        this.loading = false
      }
    },

    async createEstudiante(estudianteData) {
      try {
        const response = await api.post('/estudiantes', estudianteData)
        if (response.data.success) {
          this.estudiantes.push(response.data.data)
          return { success: true, data: response.data.data }
        }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error creando estudiante' 
        }
      }
    },

    async updateEstudiante(id, estudianteData) {
      try {
        const response = await api.put(`/estudiantes/${id}`, estudianteData)
        if (response.data.success) {
          const index = this.estudiantes.findIndex(e => e.id === id)
          if (index !== -1) {
            this.estudiantes[index] = response.data.data
          }
          return { success: true, data: response.data.data }
        }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error actualizando estudiante' 
        }
      }
    },

    async deleteEstudiante(id) {
      try {
        const response = await api.delete(`/estudiantes/${id}`)
        if (response.data.success) {
          this.estudiantes = this.estudiantes.filter(e => e.id !== id)
          return { success: true }
        }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error eliminando estudiante' 
        }
      }
    }
  },

  getters: {
    estudiantesPorGrado: (state) => {
      return state.estudiantes.reduce((acc, estudiante) => {
        const grado = estudiante.grado
        if (!acc[grado]) acc[grado] = []
        acc[grado].push(estudiante)
        return acc
      }, {})
    }
  }
})
```

### 4. Crear Store para Registros de Salida

**Archivo: `src/stores/registrosSalida.js`**

```javascript
import { defineStore } from 'pinia'
import api from '@/api'

export const useRegistrosSalidaStore = defineStore('registrosSalida', {
  state: () => ({
    registros: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchRegistros(filtros = {}) {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams(filtros).toString()
        const url = params ? `/registros-salida?${params}` : '/registros-salida'
        
        const response = await api.get(url)
        if (response.data.success) {
          this.registros = response.data.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando registros'
      } finally {
        this.loading = false
      }
    },

    async createRegistro(registroData) {
      try {
        const response = await api.post('/registros-salida', registroData)
        if (response.data.success) {
          this.registros.unshift(response.data.data)
          return { success: true, data: response.data.data }
        }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error creando registro' 
        }
      }
    },

    async updateStatus(id, estado) {
      try {
        const response = await api.patch(`/registros-salida/${id}/status`, { estado })
        if (response.data.success) {
          const index = this.registros.findIndex(r => r.id === id)
          if (index !== -1) {
            this.registros[index] = response.data.data
          }
          return { success: true, data: response.data.data }
        }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error actualizando estado' 
        }
      }
    },

    async deleteRegistro(id) {
      try {
        const response = await api.delete(`/registros-salida/${id}`)
        if (response.data.success) {
          this.registros = this.registros.filter(r => r.id !== id)
          return { success: true }
        }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error eliminando registro' 
        }
      }
    }
  },

  getters: {
    registrosPendientes: (state) => state.registros.filter(r => r.estado === 'pendiente'),
    registrosConfirmados: (state) => state.registros.filter(r => r.estado === 'confirmada'),
    registrosRechazados: (state) => state.registros.filter(r => r.estado === 'rechazada')
  }
})
```

### 5. Actualizar Componentes

**Ejemplo de componente actualizado:**

```vue
<template>
  <div class="estudiantes-list">
    <div v-if="loading" class="loading">
      Cargando estudiantes...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <div v-for="estudiante in estudiantes" :key="estudiante.id" class="estudiante-card">
        <h3>{{ estudiante.nombre_completo }}</h3>
        <p>{{ estudiante.grado_seccion }}</p>
        
        <button @click="crearLlamada(estudiante.id)" :disabled="creandoLlamada">
          {{ creandoLlamada ? 'Creando...' : 'Llamar para salida' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEstudiantesStore } from '@/stores/estudiantes'
import { useRegistrosSalidaStore } from '@/stores/registrosSalida'
import { useToast } from 'vue-toastification'

const estudiantesStore = useEstudiantesStore()
const registrosStore = useRegistrosSalidaStore()
const toast = useToast()

const creandoLlamada = ref(false)

const { estudiantes, loading, error } = estudiantesStore

onMounted(() => {
  estudiantesStore.fetchEstudiantes()
})

const crearLlamada = async (estudianteId) => {
  creandoLlamada.value = true
  
  const result = await registrosStore.createRegistro({
    estudiante_id: estudianteId,
    motivo: 'Salida solicitada por el padre'
  })
  
  if (result.success) {
    toast.success('Llamada registrada exitosamente')
  } else {
    toast.error(result.error)
  }
  
  creandoLlamada.value = false
}
</script>
```

### 6. Actualizar Router Guards

**Archivo: `src/router/index.js`**

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ... tus rutas existentes
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Rutas que requieren autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Rutas que requieren rol admin
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresAdmin && !authStore.isAdmin) {
    next('/unauthorized')
  } else {
    next()
  }
})

export default router
```

## 🔧 Pasos de Migración

1. **Instalar axios** (si no lo tienes):
   ```bash
   npm install axios
   ```

2. **Crear el archivo `src/api.js`** con la configuración de axios

3. **Actualizar stores** con las nuevas funciones de API

4. **Actualizar componentes** para usar los nuevos stores

5. **Probar la integración** con el backend Laravel

6. **Remover dependencias de Supabase**:
   ```bash
   npm uninstall @supabase/supabase-js
   ```

## 🚀 Beneficios de la Migración

- **Control total** sobre la lógica de negocio
- **Mejor rendimiento** con consultas optimizadas
- **Flexibilidad** para customizaciones específicas
- **Costos reducidos** al no depender de servicios externos
- **Mejor debugging** y logging
- **Integración más fácil** con otros sistemas

## 🔍 Testing

Asegúrate de probar:

- ✅ Login y logout
- ✅ Registro con código de invitación
- ✅ Listado de estudiantes
- ✅ Creación de llamadas
- ✅ Cambio de estado de llamadas (admin)
- ✅ Permisos por rol
- ✅ Manejo de errores

¡Tu migración a Laravel está lista! 🎉