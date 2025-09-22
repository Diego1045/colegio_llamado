import { apiService } from './api.js'

export const registrosService = {
  async getAll() {
    try {
      const response = await apiService.get('/registros-salida')
      return response.data
    } catch (error) {
      console.error('Error al obtener registros:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await apiService.get(`/registros-salida/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener registro:', error)
      throw error
    }
  },

  async create(registroData) {
    try {
      const response = await apiService.post('/registros-salida', registroData)
      return response.data
    } catch (error) {
      console.error('Error al crear registro:', error)
      throw error
    }
  },

  async update(id, registroData) {
    try {
      const response = await apiService.put(`/registros-salida/${id}`, registroData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar registro:', error)
      throw error
    }
  },

  async updateStatus(id, estado) {
    try {
      const response = await apiService.patch(`/registros-salida/${id}/status`, { estado })
      return response.data
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const response = await apiService.delete(`/registros-salida/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar registro:', error)
      throw error
    }
  }
}