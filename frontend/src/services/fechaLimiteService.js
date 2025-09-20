import api from './api';
import { notificacionService } from './notificacionService';

export const fechaLimiteService = {
  // Obtener todas las fechas límite
  async getFechasLimite(params = {}) {
    try {
      const response = await api.get('/fechas-limite', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener fechas límite:', error);
      throw error;
    }
  },

  // Obtener una fecha límite por ID
  async getFechaLimiteById(id) {
    try {
      const response = await api.get(`/fechas-limite/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener fecha límite:', error);
      throw error;
    }
  },

  // Obtener fechas límite próximas
  async getFechasLimiteProximas(dias = 7) {
    try {
      const response = await api.get('/fechas-limite/proximas', { 
        params: { dias } 
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener fechas límite próximas:', error);
      throw error;
    }
  },

  // Crear una nueva fecha límite
  async createFechaLimite(fechaLimiteData) {
    try {
      const response = await api.post('/fechas-limite', fechaLimiteData);
      return response.data;
    } catch (error) {
      console.error('Error al crear fecha límite:', error);
      throw error;
    }
  },

  // Actualizar una fecha límite
  async updateFechaLimite(id, fechaLimiteData, notificarCambios = true) {
    try {
      // Obtener la fecha límite original para comparar cambios
      const fechaOriginal = await this.getFechaLimiteById(id);
      
      const response = await api.put(`/fechas-limite/${id}`, fechaLimiteData);
      const fechaActualizada = response.data;
      
      // Si se solicita notificar cambios, enviar notificaciones automáticas
      if (notificarCambios && fechaOriginal && fechaActualizada) {
        await this.notificarCambiosFechaLimite(fechaOriginal, fechaActualizada);
      }
      
      return fechaActualizada;
    } catch (error) {
      console.error('Error al actualizar fecha límite:', error);
      throw error;
    }
  },

  // Eliminar una fecha límite
  async deleteFechaLimite(id) {
    try {
      const response = await api.delete(`/fechas-limite/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar fecha límite:', error);
      throw error;
    }
  },

  // Activar/Desactivar una fecha límite
  async toggleFechaLimite(id) {
    try {
      const response = await api.patch(`/fechas-limite/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de fecha límite:', error);
      throw error;
    }
  },

  // Obtener todos los docentes para notificaciones
  async getDocentesParaNotificaciones() {
    try {
      const response = await api.get('/usuarios', { 
        params: { rol: 'docente' } 
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener docentes:', error);
      return [];
    }
  },

  // Notificar cambios en fecha límite
  async notificarCambiosFechaLimite(fechaOriginal, fechaActualizada) {
    try {
      const cambios = this.detectarCambiosFechaLimite(fechaOriginal, fechaActualizada);
      
      if (cambios.length > 0) {
        // Obtener todos los docentes para notificar
        const docentes = await this.getDocentesParaNotificaciones();
        const usuariosDestino = docentes.map(docente => docente.id || docente.id_usuario);
        
        // Crear mensaje de notificación
        const mensaje = this.generarMensajeNotificacion(fechaActualizada, cambios);
        
        // Enviar notificaciones
        await notificacionService.notificarCambioFechaLimite(
          fechaActualizada.id_fecha_limite,
          mensaje,
          usuariosDestino
        );
        
        console.log(`Notificaciones enviadas a ${usuariosDestino.length} docentes sobre cambios en fecha límite: ${fechaActualizada.nombre}`);
      }
    } catch (error) {
      console.error('Error al notificar cambios en fecha límite:', error);
      // No lanzar error para no interrumpir la actualización de la fecha límite
    }
  },

  // Detectar cambios en fecha límite
  detectarCambiosFechaLimite(fechaOriginal, fechaActualizada) {
    const cambios = [];
    
    // Verificar cambio en la fecha
    const fechaOriginalStr = new Date(fechaOriginal.fecha_limite).toLocaleDateString('es-ES');
    const fechaActualizadaStr = new Date(fechaActualizada.fecha_limite).toLocaleDateString('es-ES');
    
    if (fechaOriginalStr !== fechaActualizadaStr) {
      cambios.push(`Fecha cambió de ${fechaOriginalStr} a ${fechaActualizadaStr}`);
    }
    
    // Verificar cambio en el nombre
    if (fechaOriginal.nombre !== fechaActualizada.nombre) {
      cambios.push(`Nombre cambió de "${fechaOriginal.nombre}" a "${fechaActualizada.nombre}"`);
    }
    
    // Verificar cambio en la descripción
    if (fechaOriginal.descripcion !== fechaActualizada.descripcion) {
      cambios.push('Descripción actualizada');
    }
    
    // Verificar cambio en la categoría
    if (fechaOriginal.categoria !== fechaActualizada.categoria) {
      cambios.push(`Categoría cambió de "${fechaOriginal.categoria}" a "${fechaActualizada.categoria}"`);
    }
    
    // Verificar cambio en el estado
    if (fechaOriginal.activo !== fechaActualizada.activo) {
      const estado = fechaActualizada.activo ? 'activada' : 'desactivada';
      cambios.push(`Fecha límite ${estado}`);
    }
    
    return cambios;
  },

  // Generar mensaje de notificación
  generarMensajeNotificacion(fechaLimite, cambios) {
    const fechaStr = new Date(fechaLimite.fecha_limite).toLocaleDateString('es-ES');
    
    let mensaje = `📅 ACTUALIZACIÓN DE FECHA LÍMITE\n\n`;
    mensaje += `Fecha límite: "${fechaLimite.nombre}"\n`;
    mensaje += `Nueva fecha: ${fechaStr}\n\n`;
    mensaje += `Cambios realizados:\n`;
    
    cambios.forEach((cambio, index) => {
      mensaje += `• ${cambio}\n`;
    });
    
    mensaje += `\nPor favor, tome nota de estos cambios y ajuste su planificación académica en consecuencia.`;
    
    return mensaje;
  }
};

export default fechaLimiteService;