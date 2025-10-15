import api from './api';

class EstadisticaService {
  // ⭐ MÉTODO PRINCIPAL - Obtiene todas las estadísticas del dashboard de una vez
  async getDashboardStats() {
    try {
      const response = await api.get('/estadisticas/dashboard');
      console.log('📥 [EstadisticaService] Respuesta /estadisticas/dashboard (response.data):', response?.data);
      console.log('📥 [EstadisticaService] Extrayendo response.data.data:', response?.data?.data);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  }

  // Métodos individuales (por si se necesitan por separado)
  async getGeneralStats() {
    try {
      const response = await api.get('/estadisticas/general');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const response = await api.get('/estadisticas/usuarios');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de usuarios:', error);
      throw error;
    }
  }

  async getReportStats() {
    try {
      const response = await api.get('/estadisticas/reportes');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de reportes:', error);
      throw error;
    }
  }

  async getActivityStats() {
    try {
      const response = await api.get('/estadisticas/actividades');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de actividades:', error);
      throw error;
    }
  }

  async getDeadlineStats() {
    try {
      const response = await api.get('/estadisticas/fechas-limite');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de fechas límite:', error);
      throw error;
    }
  }

  async getNotificationStats() {
    try {
      const response = await api.get('/estadisticas/notificaciones');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de notificaciones:', error);
      throw error;
    }
  }

  async getPeriodStats(periodId) {
    try {
      const response = await api.get(`/estadisticas/periodo/${periodId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del periodo:', error);
      throw error;
    }
  }

  async getUserSpecificStats(userId) {
    try {
      const response = await api.get(`/estadisticas/usuario/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del usuario:', error);
      throw error;
    }
  }

  // Método de transformación para compatibilidad con el código existente
  transformActivityStatsForDashboard(dashboardStats) {
    if (!dashboardStats?.actividades) {
      console.warn('⚠️ [EstadisticaService] dashboardStats.actividades vacío o indefinido. Asignando ceros.');
      return {
        completadas: 0,
        pendientes: 0,
        devueltas: 0,
        total: 0,
        porcentajes: {
          completadas: 0,
          pendientes: 0,
          devueltas: 0
        }
      };
    }

    const { actividades } = dashboardStats;
    
    // ⭐ Mapear los datos al formato que espera el AdminDashboard
    const completadas = actividades.aprobadas || 0;
    const pendientes = actividades.pendientes || 0;
    const devueltas = actividades.devueltas || 0;
    const total = actividades.total || 0;
    
    // Calcular porcentajes
    const porcentajes = {
      completadas: total > 0 ? Math.round((completadas / total) * 100) : 0,
      pendientes: total > 0 ? Math.round((pendientes / total) * 100) : 0,
      devueltas: total > 0 ? Math.round((devueltas / total) * 100) : 0
    };
    
    const transformed = {
      completadas,
      pendientes,
      devueltas,
      total,
      porcentajes
    };
    console.log('🧭 [EstadisticaService] transformActivityStatsForDashboard resultado:', transformed);
    return transformed;
  }
}

export default new EstadisticaService();