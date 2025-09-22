import { apiService } from './api.js'

export const userService = {
  // Obtener todos los usuarios
  async getUsers() {
    try {
      const response = await apiService.get('/usuarios')
      return response.data || []
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  },

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const response = await apiService.post('/usuarios', userData)
      return response.data
    } catch (error) {
      console.error('Error al crear usuario:', error)
      throw error
    }
  },

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      const response = await apiService.put(`/usuarios/${id}`, userData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      throw error
    }
  },

  // Eliminar usuario
  async deleteUser(id) {
    try {
      const response = await apiService.delete(`/usuarios/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      throw error
    }
  },

  // Obtener padres
  async getPadres() {
    try {
      const response = await apiService.get('/padres')
      return response.data || []
    } catch (error) {
      console.error('Error al obtener padres:', error)
      throw error
    }
  },

  // Crear padre
  async createPadre(padreData) {
    try {
      const response = await apiService.post('/padres', padreData)
      return response.data
    } catch (error) {
      console.error('Error al crear padre:', error)
      throw error
    }
  },

  // Actualizar padre
  async updatePadre(id, padreData) {
    try {
      const response = await apiService.put(`/padres/${id}`, padreData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar padre:', error)
      throw error
    }
  },

  // Eliminar padre
  async deletePadre(id) {
    try {
      const response = await apiService.delete(`/padres/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar padre:', error)
      throw error
    }
  }
}