import api from './api';

export const notificacionService = {
  // Obtener todas las notificaciones
  async getAll(params = {}) {
    try {
      const response = await api.get('/notificaciones', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  },

  // Obtener notificaciones por usuario
  async getByUsuario(idUsuario, params = {}) {
    try {
      const response = await api.get(`/notificaciones/usuario/${idUsuario}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones del usuario:', error);
      throw error;
    }
  },

  // Obtener notificaciones no leídas por usuario
  async getNoLeidasByUsuario(idUsuario) {
    try {
      const response = await api.get(`/notificaciones/usuario/${idUsuario}/no-leidas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones no leídas:', error);
      throw error;
    }
  },

  // Obtener una notificación por ID
  async getById(id) {
    try {
      const response = await api.get(`/notificaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      throw error;
    }
  },

  // Crear una nueva notificación
  async create(notificacionData) {
    try {
      const response = await api.post('/notificaciones', notificacionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  },

  // Marcar notificación como leída
  async marcarComoLeida(id) {
    try {
      const response = await api.patch(`/notificaciones/${id}/leer`);
      return response.data;
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  },

  // Marcar todas las notificaciones de un usuario como leídas
  async marcarTodasComoLeidas(idUsuario) {
    try {
      const response = await api.patch(`/notificaciones/usuario/${idUsuario}/leer-todas`);
      return response.data;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  },

  // Eliminar una notificación
  async delete(id) {
    try {
      const response = await api.delete(`/notificaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  },

  // Obtener estadísticas de notificaciones
  async getEstadisticas(idUsuario) {
    try {
      const response = await api.get(`/notificaciones/usuario/${idUsuario}/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de notificaciones:', error);
      throw error;
    }
  },

  // Crear notificación de cambio en fecha límite
  async notificarCambioFechaLimite(fechaLimiteId, mensaje, usuariosDestino) {
    try {
      const notificaciones = [];
      
      for (const usuarioId of usuariosDestino) {
        const notificacionData = {
          id_usuario_destino: usuarioId,
          mensaje: mensaje,
          tipo: 'FECHA_LIMITE',
          id_fecha_limite: fechaLimiteId
        };
        
        const notificacion = await this.create(notificacionData);
        notificaciones.push(notificacion);
      }
      
      return notificaciones;
    } catch (error) {
      console.error('Error al crear notificaciones de cambio en fecha límite:', error);
      throw error;
    }
  },

  // Crear notificación de recordatorio de fecha límite
  async crearRecordatorioFechaLimite(fechaLimiteId, usuarioId) {
    try {
      const notificacionData = {
        id_usuario_destino: usuarioId,
        mensaje: `Recordatorio: Se acerca una fecha límite importante`,
        tipo: 'FECHA_LIMITE',
        id_fecha_limite: fechaLimiteId
      };
      
      const notificacion = await this.create(notificacionData);
      return notificacion;
    } catch (error) {
      console.error('Error al crear recordatorio de fecha límite:', error);
      throw error;
    }
  }
};