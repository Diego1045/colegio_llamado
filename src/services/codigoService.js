import { apiService } from './api.js'

export const codigoService = {
  // Obtener todos los códigos
  async getCodigos() {
    try {
      const response = await apiService.get('/codigos')
      return response.data || []
    } catch (error) {
      console.error('Error al obtener códigos:', error)
      throw error
    }
  },

  // Generar códigos de invitación
  async generarCodigos(cantidad) {
    try {
      const response = await apiService.post('/codigos/generar', { cantidad })
      return response.data
    } catch (error) {
      console.error('Error al generar códigos:', error)
      throw error
    }
  },

  // Invalidar código
  async invalidarCodigo(id) {
    try {
      const response = await apiService.patch(`/codigos/${id}/invalidar`)
      return response.data
    } catch (error) {
      console.error('Error al invalidar código:', error)
      throw error
    }
  },

  // Validar código de invitación
  async validarCodigo(codigo) {
    try {
      const response = await apiService.post('/codigos/validar', { codigo })
      return response.data
    } catch (error) {
      console.error('Error al validar código:', error)
      throw error
    }
  }
}