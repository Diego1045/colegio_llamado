import { apiService } from './api.js'

export const padreEstudianteService = {
  // Obtener hijos asignados a un padre
  async getHijosAsignados(padreId) {
    try {
      const response = await apiService.get(`/padres/${padreId}/hijos`)
      return response.data || []
    } catch (error) {
      console.error('Error al obtener hijos asignados:', error)
      throw error
    }
  },

  // Asignar hijo a padre
  async asignarHijo(padreId, estudianteId) {
    try {
      const response = await apiService.post(`/padres/${padreId}/hijos`, {
        estudiante_id: estudianteId
      })
      return response.data
    } catch (error) {
      console.error('Error al asignar hijo:', error)
      throw error
    }
  },

  // Desasignar hijo de padre
  async desasignarHijo(padreId, estudianteId) {
    try {
      const response = await apiService.delete(`/padres/${padreId}/hijos/${estudianteId}`)
      return response.data
    } catch (error) {
      console.error('Error al desasignar hijo:', error)
      throw error
    }
  },

  // Crear nuevo estudiante y asignarlo al padre
  async crearYAsignarHijo(padreId, estudianteData) {
    try {
      const response = await apiService.post(`/padres/${padreId}/crear-hijo`, estudianteData)
      return response.data
    } catch (error) {
      console.error('Error al crear y asignar hijo:', error)
      throw error
    }
  }
}