import { apiService } from './api.js'

export const estudiantesService = {
  async getAll() {
    try {
      const response = await apiService.get('/estudiantes')
      return response.data
    } catch (error) {
      console.error('Error al obtener estudiantes:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await apiService.get(`/estudiantes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener estudiante:', error)
      throw error
    }
  },

  async create(estudianteData) {
    try {
      const response = await apiService.post('/estudiantes', estudianteData)
      return response.data
    } catch (error) {
      console.error('Error al crear estudiante:', error)
      throw error
    }
  },

  async update(id, estudianteData) {
    try {
      const response = await apiService.put(`/estudiantes/${id}`, estudianteData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar estudiante:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const response = await apiService.delete(`/estudiantes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar estudiante:', error)
      throw error
    }
  }
}