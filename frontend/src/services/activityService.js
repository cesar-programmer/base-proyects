import api from './api';

const activityService = {
  // Obtener todas las actividades
  getAllActivities: async () => {
    try {
      const response = await api.get('/actividades');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividades');
    }
  },

  // Obtener actividad por ID
  getActivityById: async (id) => {
    try {
      const response = await api.get(`/actividades/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividad');
    }
  },

  // Crear nueva actividad
  createActivity: async (activityData) => {
    try {
      const response = await api.post('/actividades', activityData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear actividad');
    }
  },

  // Actualizar actividad
  updateActivity: async (id, activityData) => {
    try {
      const response = await api.put(`/actividades/${id}`, activityData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar actividad');
    }
  },

  // Eliminar actividad
  deleteActivity: async (id) => {
    try {
      const response = await api.delete(`/actividades/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar actividad');
    }
  },

  // Obtener actividades por docente
  getActivitiesByTeacher: async (docenteId) => {
    try {
      const response = await api.get(`/actividades/usuario/${docenteId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividades del docente');
    }
  },

  // Obtener actividades por estado
  getActivitiesByStatus: async (estado) => {
    try {
      const response = await api.get(`/actividades/estado/${estado}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividades por estado');
    }
  },

  // Cambiar estado de actividad
  changeActivityStatus: async (id, nuevoEstado) => {
    try {
      const response = await api.patch(`/actividades/${id}/estado`, { estado: nuevoEstado });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar estado de actividad');
    }
  },

  // Obtener tipos de actividades
  getActivityTypes: async () => {
    try {
      const response = await api.get('/actividades/tipos');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener tipos de actividades');
    }
  },

  // Obtener estadísticas de actividades
  getActivityStats: async () => {
    try {
      const response = await api.get('/actividades/estadisticas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  // Obtener estadísticas de actividades por estado para el dashboard
  getActivityStatsByStatus: async () => {
    try {
      const response = await api.get('/actividades/estadisticas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas por estado');
    }
  },

  // Obtener actividades pendientes para el dashboard
  getPendingActivitiesForDashboard: async (limit = 5) => {
    try {
      const response = await api.get(`/actividades/pendientes-dashboard?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener actividades pendientes');
    }
  },

  // Aprobar actividad
  approveActivity: async (id, comentarios = '') => {
    try {
      const response = await api.patch(`/actividades/${id}/aprobar`, { comentarios });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al aprobar actividad');
    }
  },

  // Rechazar actividad
  rejectActivity: async (id, motivo) => {
    try {
      const response = await api.patch(`/actividades/${id}/rechazar`, { motivo });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al rechazar actividad');
    }
  },

  // Actualizar estado de actividad
  updateActivityStatus: async (id, nuevoEstado) => {
    try {
      const response = await api.patch(`/actividades/${id}/estado`, { estado_realizado: nuevoEstado });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar estado de actividad');
    }
  },

  // Cambiar actividad a estado pendiente
  setPendingActivity: async (id) => {
    try {
      const response = await api.patch(`/actividades/${id}/estado`, { estado_realizado: 'pendiente' });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar actividad a pendiente');
    }
  }
};

export default activityService;