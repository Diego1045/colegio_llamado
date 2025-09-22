import { apiService } from './api.js'

export const anuncioService = {
  // Obtener todos los anuncios
  async getAnuncios() {
    try {
      const response = await apiService.get('/anuncios')
      return response.data || []
    } catch (error) {
      console.error('Error al obtener anuncios:', error)
      throw error
    }
  },

  // Crear nuevo anuncio
  async createAnuncio(anuncioData) {
    try {
      const response = await apiService.post('/anuncios', anuncioData)
      return response.data
    } catch (error) {
      console.error('Error al crear anuncio:', error)
      throw error
    }
  },

  // Actualizar anuncio
  async updateAnuncio(id, anuncioData) {
    try {
      const response = await apiService.put(`/anuncios/${id}`, anuncioData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar anuncio:', error)
      throw error
    }
  },

  // Eliminar anuncio
  async deleteAnuncio(id) {
    try {
      const response = await apiService.delete(`/anuncios/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar anuncio:', error)
      throw error
    }
  },

  // Reproducir anuncio
  async reproducirAnuncio(id) {
    try {
      const response = await apiService.post(`/anuncios/${id}/reproducir`)
      return response.data
    } catch (error) {
      console.error('Error al reproducir anuncio:', error)
      throw error
    }
  }
}