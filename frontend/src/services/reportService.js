import api from './api';

const reportService = {
  // Obtener todos los reportes
  getAllReports: async () => {
    try {
      const response = await api.get('/reportes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes');
    }
  },

  // Obtener reporte por ID
  getReportById: async (id) => {
    try {
      const response = await api.get(`/reportes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener reporte');
    }
  },

  // Crear nuevo reporte
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reportes', reportData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear reporte');
    }
  },

  // Actualizar reporte
  updateReport: async (id, reportData) => {
    try {
      const response = await api.put(`/reportes/${id}`, reportData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar reporte');
    }
  },

  // Eliminar reporte
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reportes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar reporte');
    }
  },

  // Obtener reportes por docente
  getReportsByTeacher: async (docenteId) => {
    try {
      const response = await api.get(`/reportes/docente/${docenteId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes del docente');
    }
  },

  // Obtener reportes por estado
  getReportsByStatus: async (estado) => {
    try {
      const response = await api.get(`/reportes/estado/${estado}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes por estado');
    }
  },

  // Obtener reportes pendientes
  getPendingReports: async () => {
    try {
      const response = await api.get('/reportes/pendientes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes pendientes');
    }
  },

  // Cambiar estado de reporte
  changeReportStatus: async (id, nuevoEstado, comentarios = '') => {
    try {
      const response = await api.patch(`/reportes/${id}/estado`, { 
        estado: nuevoEstado,
        comentarios 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar estado de reporte');
    }
  },

  // Aprobar reporte
  approveReport: async (id, comentarios = '') => {
    try {
      const response = await api.patch(`/reportes/${id}/aprobar`, { comentarios });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al aprobar reporte');
    }
  },

  // Rechazar reporte
  rejectReport: async (id, comentarios) => {
    try {
      const response = await api.patch(`/reportes/${id}/rechazar`, { comentarios });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al rechazar reporte');
    }
  },

  // Obtener historial de reportes
  getReportHistory: async (docenteId, fechaInicio, fechaFin) => {
    try {
      const params = new URLSearchParams();
      if (docenteId) params.append('docenteId', docenteId);
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);
      
      const response = await api.get(`/reportes/historial?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener historial de reportes');
    }
  },

  // Obtener estadísticas de reportes
  getReportStats: async () => {
    try {
      const response = await api.get('/reportes/estadisticas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de reportes');
    }
  },

  // Exportar reportes
  exportReports: async (filtros = {}) => {
    try {
      const response = await api.post('/reportes/exportar', filtros, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al exportar reportes');
    }
  }
};

export default reportService;