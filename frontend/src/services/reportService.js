import api from './api';

const reportService = {
  // Obtener todos los reportes
  getAllReports: async () => {
    try {
      const response = await api.get('/reportes?limit=1000'); // Aumentar límite para obtener todos los reportes
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
      const response = await api.get(`/reportes?estado=${estado}`);
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
      const response = await api.patch(`/reportes/${id}/status`, { 
        estado: nuevoEstado,
        comentariosRevision: comentarios 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar estado de reporte');
    }
  },

  // Enviar reporte (para docentes) - cambiar de Pendiente a En revisión
  sendReport: async (id) => {
    try {
      const response = await api.patch(`/reportes/${id}/enviar`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al enviar reporte');
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

  // Aprobar reporte rápidamente
  quickApproveReport: async (id) => {
    try {
      const response = await api.patch(`/reportes/${id}/aprobar-rapido`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al aprobar reporte rápidamente');
    }
  },

  // Rechazar reporte
  rejectReport: async (id, razon) => {
    try {
      const response = await api.patch(`/reportes/${id}/rechazar`, { razon });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al rechazar reporte');
    }
  },

  // Devolver reporte a pendiente
  returnReportToPending: async (id, razon) => {
    try {
      const response = await api.patch(`/reportes/${id}/devolver-pendiente`, { razon });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al devolver reporte a pendiente');
    }
  },

  // Devolver reporte a revisión
  returnReportToReview: async (id, razon) => {
    try {
      const response = await api.patch(`/reportes/${id}/devolver-revision`, { razon });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al devolver reporte a revisión');
    }
  },

  // Actualizar estado del reporte
  updateReportStatus: async (id, estado, comentarios = '') => {
    try {
      const response = await api.patch(`/reportes/${id}/estado`, { estado, comentarios });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar estado del reporte');
    }
  },

  // Obtener reportes pendientes para el dashboard
  getPendingReportsForDashboard: async () => {
    try {
      const response = await api.get('/reportes/pending/dashboard');
      return response.data.data.reportes; // Extraer el array de reportes del objeto
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes pendientes para el dashboard');
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
      const response = await api.get('/reportes/stats/general');
      return response.data.data;
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
  },

  // Descargar reporte individual en PDF
  downloadReportPDF: async (id) => {
    try {
      const response = await api.get(`/reportes/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al descargar reporte en PDF');
    }
  },

  // Obtener información de fecha límite y semestre actual
  getDeadlineInfo: async () => {
    try {
      const response = await api.get('/reportes/deadline/info');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener información de fecha límite');
    }
  },

  // Obtener reportes devueltos para correcciones
  getReturnedReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('estado', 'devuelto'); // Solo reportes devueltos
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.search) params.append('search', filters.search);
      if (filters.period) params.append('period', filters.period);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await api.get(`/reportes?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes devueltos');
    }
  },


};

export default reportService;