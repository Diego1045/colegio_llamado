import { apiService } from './api.js'

export const authService = {
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', {
        email,
        password
      })
      
      if (response.success && response.data.token) {
        apiService.setToken(response.data.token)
        return response.data
      }
      
      throw new Error(response.message || 'Error en el login')
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  },

  async logout() {
    try {
      await apiService.post('/auth/logout')
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      apiService.setToken(null)
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiService.get('/auth/me')
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario actual:', error)
      throw error
    }
  },

  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  },

  async validateInvitationCode(code) {
    try {
      const response = await apiService.post('/auth/validate-code', { codigo: code })
      return response.data
    } catch (error) {
      console.error('Error validando código:', error)
      throw error
    }
  },

  // Verificar si hay token válido
  hasValidToken() {
    return !!apiService.getToken()
  }
}