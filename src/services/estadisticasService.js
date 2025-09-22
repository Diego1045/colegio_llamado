import { apiService } from './api.js'

export const estadisticasService = {
  // Obtener estadísticas generales
  async getEstadisticasGenerales() {
    try {
      const response = await apiService.get('/estadisticas/generales')
      return response.data
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      throw error
    }
  },

  // Obtener llamadas recientes
  async getLlamadasRecientes() {
    try {
      const response = await apiService.get('/estadisticas/llamadas-recientes')
      return response.data || []
    } catch (error) {
      console.error('Error al obtener llamadas recientes:', error)
      throw error
    }
  },

  // Obtener datos para gráficos
  async getDatosGraficos() {
    try {
      const response = await apiService.get('/estadisticas/graficos')
      return response.data
    } catch (error) {
      console.error('Error al obtener datos de gráficos:', error)
      throw error
    }
  },

  // Generar reporte de llamadas
  async generarReporteLlamadas() {
    try {
      const response = await apiService.get('/reportes/llamadas')
      return response.data
    } catch (error) {
      console.error('Error al generar reporte de llamadas:', error)
      throw error
    }
  },

  // Generar reporte de códigos
  async generarReporteCodigos() {
    try {
      const response = await apiService.get('/reportes/codigos')
      return response.data
    } catch (error) {
      console.error('Error al generar reporte de códigos:', error)
      throw error
    }
  }
}