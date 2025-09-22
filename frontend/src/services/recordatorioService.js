import api from './api';
import { notificacionService } from './notificacionService';

export const recordatorioService = {
  // Obtener configuración de recordatorios
  async getConfiguracion() {
    try {
      const response = await api.get('/recordatorios/configuracion');
      return response.data.success ? response.data.data : response.data;
    } catch (error) {
      console.error('Error al obtener configuración de recordatorios:', error);
      // Retornar configuración por defecto si no existe
      return {
        activo: false,
        frecuencia: 'semanal',
        dia_semana: 'lunes',
        hora: '09:00',
        destinatarios: 'todos',
        mensaje: 'Recordatorio: Tiene actividades pendientes por completar. Por favor, revise su panel de control para más detalles.'
      };
    }
  },

  // Guardar configuración de recordatorios
  async guardarConfiguracion(configuracion) {
    try {
      const response = await api.post('/recordatorios/configuracion', configuracion);
      
      // Si se activan los recordatorios, crear notificación de confirmación
      if (configuracion.activo) {
        await notificacionService.crearNotificacion({
          tipo: 'info',
          titulo: 'Recordatorios Activados',
          mensaje: `Los recordatorios ${configuracion.frecuencia}s han sido configurados exitosamente`,
          categoria: 'sistema'
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al guardar configuración de recordatorios:', error);
      throw error;
    }
  },

  // Actualizar configuración de recordatorios
  async actualizarConfiguracion(configuracion) {
    try {
      const response = await api.put('/recordatorios/configuracion', configuracion);
      return response.data.success ? response.data.data : response.data;
    } catch (error) {
      console.error('Error al actualizar configuración de recordatorios:', error);
      throw error;
    }
  },





  // Enviar recordatorio manual con integración de notificaciones
  async enviarRecordatorioManual(configuracion) {
    try {
      const response = await api.post('/recordatorios/enviar-manual', configuracion);
      return response.data.success ? response.data.data : response.data;
    } catch (error) {
      console.error('Error al enviar recordatorio manual:', error);
      throw error;
    }
  },

  // Obtener usuarios que recibirán recordatorios
  async getDestinatarios(tipo = 'todos') {
    try {
      const response = await api.get(`/recordatorios/destinatarios?tipo=${tipo}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener destinatarios:', error);
      // Retornar datos de ejemplo
      return {
        usuarios: [
          { id: 1, nombre: 'Dr. Juan Pérez', email: 'juan.perez@universidad.edu', reportes_pendientes: 2 },
          { id: 2, nombre: 'Dra. María García', email: 'maria.garcia@universidad.edu', reportes_pendientes: 1 },
          { id: 3, nombre: 'Dr. Carlos López', email: 'carlos.lopez@universidad.edu', reportes_pendientes: 0 },
          { id: 4, nombre: 'Dra. Ana Martínez', email: 'ana.martinez@universidad.edu', reportes_pendientes: 3 }
        ],
        total: tipo === 'pendientes' ? 3 : 4
      };
    }
  },

  // Previsualizar recordatorio
  async previsualizarRecordatorio(configuracion) {
    try {
      const destinatarios = await this.getDestinatarios(configuracion.destinatarios);
      
      return {
        mensaje: configuracion.mensaje,
        destinatarios_count: destinatarios.total,
        fecha_programada: this.calcularProximaFecha(configuracion),
        vista_previa: {
          asunto: 'Recordatorio UABC - Actividades Pendientes',
          contenido: configuracion.mensaje,
          remitente: 'Sistema de Gestión Académica UABC'
        }
      };
    } catch (error) {
      console.error('Error al previsualizar recordatorio:', error);
      throw error;
    }
  },

  // Calcular próxima fecha de envío
  calcularProximaFecha(configuracion) {
    const ahora = new Date();
    const [hora, minutos] = configuracion.hora.split(':');
    
    let proximaFecha = new Date();
    proximaFecha.setHours(parseInt(hora), parseInt(minutos), 0, 0);
    
    switch (configuracion.frecuencia) {
      case 'diario':
        if (proximaFecha <= ahora) {
          proximaFecha.setDate(proximaFecha.getDate() + 1);
        }
        break;
        
      case 'semanal':
        const diasSemana = {
          'lunes': 1, 'martes': 2, 'miercoles': 3, 
          'jueves': 4, 'viernes': 5, 'sabado': 6, 'domingo': 0
        };
        const diaObjetivo = diasSemana[configuracion.dia_semana];
        const diaActual = proximaFecha.getDay();
        
        let diasHasta = diaObjetivo - diaActual;
        if (diasHasta <= 0 || (diasHasta === 0 && proximaFecha <= ahora)) {
          diasHasta += 7;
        }
        
        proximaFecha.setDate(proximaFecha.getDate() + diasHasta);
        break;
        
      case 'mensual':
        if (proximaFecha <= ahora) {
          proximaFecha.setMonth(proximaFecha.getMonth() + 1);
        }
        break;
    }
    
    return proximaFecha.toISOString();
  },

  // Activar/desactivar recordatorios con notificación
  async toggleRecordatorios(activo) {
    try {
      const response = await api.patch('/recordatorios/toggle', { activo });
      return response.data.success ? response.data.data : response.data;
    } catch (error) {
      console.error('Error al cambiar estado de recordatorios:', error);
      throw error;
    }
  },

  // Obtener estadísticas de recordatorios
  async getEstadisticas() {
    try {
      const response = await api.get('/recordatorios/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de recordatorios:', error);
      return {
        total_enviados: 156,
        total_este_mes: 24,
        tasa_apertura: 85,
        usuarios_activos: 45,
        recordatorios_pendientes: 3,
        ultima_ejecucion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
  },

  // Programar recordatorio para una fecha específica
  async programarRecordatorio(configuracion, fechaEjecucion) {
    try {
      const response = await api.post('/recordatorios/programar', {
        ...configuracion,
        fecha_ejecucion: fechaEjecucion
      });

      await notificacionService.crearNotificacion({
        tipo: 'info',
        titulo: 'Recordatorio Programado',
        mensaje: `Recordatorio programado para ${new Date(fechaEjecucion).toLocaleDateString()}`,
        categoria: 'recordatorios'
      });

      return response.data;
    } catch (error) {
      console.error('Error al programar recordatorio:', error);
      throw error;
    }
  },

  // Cancelar recordatorio programado
  async cancelarRecordatorio(recordatorioId) {
    try {
      const response = await api.delete(`/recordatorios/${recordatorioId}`);
      
      await notificacionService.crearNotificacion({
        tipo: 'warning',
        titulo: 'Recordatorio Cancelado',
        mensaje: 'El recordatorio programado ha sido cancelado',
        categoria: 'recordatorios'
      });

      return response.data;
    } catch (error) {
      console.error('Error al cancelar recordatorio:', error);
      throw error;
    }
  }
};