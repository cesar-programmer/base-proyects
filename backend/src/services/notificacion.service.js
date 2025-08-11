const boom = require('@hapi/boom');
const { models } = require('../db/models');

class NotificacionService {
  // Obtener todas las notificaciones
  async find() {
    try {
      const notificaciones = await models.Notificacion.findAll({
        include: [
          {
            model: models.User,
            as: 'usuario_destino',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          },
          {
            model: models.FechaLimite,
            as: 'fecha_limite',
            attributes: ['id_fecha_limite', 'nombre', 'fecha_limite']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return notificaciones;
    } catch (error) {
      throw boom.internal('Error al obtener las notificaciones');
    }
  }

  // Obtener notificaciones por usuario
  async findByUser(userId) {
    try {
      const notificaciones = await models.Notificacion.findAll({
        where: { id_usuario_destino: userId },
        include: [
          {
            model: models.FechaLimite,
            as: 'fecha_limite',
            attributes: ['id_fecha_limite', 'nombre', 'fecha_limite']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return notificaciones;
    } catch (error) {
      throw boom.internal('Error al obtener las notificaciones del usuario');
    }
  }

  // Obtener notificaciones no leídas por usuario
  async findUnreadByUser(userId) {
    try {
      const notificaciones = await models.Notificacion.findAll({
        where: { 
          id_usuario_destino: userId,
          leido: false
        },
        include: [
          {
            model: models.FechaLimite,
            as: 'fecha_limite',
            attributes: ['id_fecha_limite', 'nombre', 'fecha_limite']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return notificaciones;
    } catch (error) {
      throw boom.internal('Error al obtener las notificaciones no leídas');
    }
  }

  // Obtener notificaciones por tipo
  async findByType(tipo) {
    try {
      const notificaciones = await models.Notificacion.findAll({
        where: { tipo },
        include: [
          {
            model: models.User,
            as: 'usuario_destino',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return notificaciones;
    } catch (error) {
      throw boom.internal('Error al obtener las notificaciones por tipo');
    }
  }

  // Obtener una notificación por ID
  async findOne(id) {
    try {
      const notificacion = await models.Notificacion.findByPk(id, {
        include: [
          {
            model: models.User,
            as: 'usuario_destino',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          },
          {
            model: models.FechaLimite,
            as: 'fecha_limite',
            attributes: ['id_fecha_limite', 'nombre', 'fecha_limite']
          }
        ]
      });

      if (!notificacion) {
        throw boom.notFound('Notificación no encontrada');
      }

      return notificacion;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener la notificación');
    }
  }

  // Crear una nueva notificación
  async create(notificacionData) {
    try {
      // Verificar que el usuario existe
      const usuario = await models.User.findByPk(notificacionData.id_usuario_destino);
      if (!usuario) {
        throw boom.notFound('Usuario no encontrado');
      }

      // Si es de fecha límite, verificar que existe
      if (notificacionData.id_fecha_limite) {
        const fechaLimite = await models.FechaLimite.findByPk(notificacionData.id_fecha_limite);
        if (!fechaLimite) {
          throw boom.notFound('Fecha límite no encontrada');
        }
      }

      const newNotificacion = await models.Notificacion.create(notificacionData);
      
      // Retornar con relaciones incluidas
      const notificacionWithRelations = await this.findOne(newNotificacion.id_notificacion);
      return notificacionWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear la notificación');
    }
  }

  // Actualizar una notificación
  async update(id, notificacionData) {
    try {
      const notificacion = await this.findOne(id);

      // Si se está cambiando el usuario, verificar que existe
      if (notificacionData.id_usuario_destino && notificacionData.id_usuario_destino !== notificacion.id_usuario_destino) {
        const usuario = await models.User.findByPk(notificacionData.id_usuario_destino);
        if (!usuario) {
          throw boom.notFound('Usuario no encontrado');
        }
      }

      // Si se está cambiando la fecha límite, verificar que existe
      if (notificacionData.id_fecha_limite && notificacionData.id_fecha_limite !== notificacion.id_fecha_limite) {
        const fechaLimite = await models.FechaLimite.findByPk(notificacionData.id_fecha_limite);
        if (!fechaLimite) {
          throw boom.notFound('Fecha límite no encontrada');
        }
      }

      const updatedNotificacion = await notificacion.update(notificacionData);
      
      // Retornar con relaciones incluidas
      const notificacionWithRelations = await this.findOne(id);
      return notificacionWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar la notificación');
    }
  }

  // Eliminar una notificación
  async delete(id) {
    try {
      const notificacion = await this.findOne(id);
      await notificacion.destroy();
      return { message: 'Notificación eliminada correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar la notificación');
    }
  }

  // Marcar notificación como leída
  async markAsRead(id) {
    try {
      const notificacion = await this.findOne(id);
      await notificacion.update({ leido: true });
      
      return { 
        message: 'Notificación marcada como leída',
        leido: true
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al marcar notificación como leída');
    }
  }

  // Marcar todas las notificaciones de un usuario como leídas
  async markAllAsRead(userId) {
    try {
      await models.Notificacion.update(
        { leido: true },
        { where: { id_usuario_destino: userId } }
      );
      
      return { message: 'Todas las notificaciones marcadas como leídas' };
    } catch (error) {
      throw boom.internal('Error al marcar notificaciones como leídas');
    }
  }

  // Crear notificación de recordatorio de fecha límite
  async createDeadlineReminder(fechaLimiteId, userId) {
    try {
      const fechaLimite = await models.FechaLimite.findByPk(fechaLimiteId);
      if (!fechaLimite) {
        throw boom.notFound('Fecha límite no encontrada');
      }

      const usuario = await models.User.findByPk(userId);
      if (!usuario) {
        throw boom.notFound('Usuario no encontrado');
      }

      const notificacion = await this.create({
        id_usuario_destino: userId,
        mensaje: `Recordatorio: La fecha límite "${fechaLimite.nombre}" vence el ${fechaLimite.fecha_limite.toLocaleDateString('es-ES')}`,
        tipo: 'FECHA_LIMITE',
        id_fecha_limite: fechaLimiteId
      });

      return notificacion;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear recordatorio de fecha límite');
    }
  }

  // Crear notificación de aprobación de reporte
  async createApprovalNotification(reporteId, userId, mensaje = null) {
    try {
      const reporte = await models.Reporte.findByPk(reporteId);
      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      const notificacion = await this.create({
        id_usuario_destino: userId,
        mensaje: mensaje || 'Tu reporte ha sido aprobado exitosamente',
        tipo: 'APROBACION'
      });

      return notificacion;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear notificación de aprobación');
    }
  }

  // Crear notificación de devolución de reporte
  async createReturnNotification(reporteId, userId, observaciones) {
    try {
      const reporte = await models.Reporte.findByPk(reporteId);
      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      const notificacion = await this.create({
        id_usuario_destino: userId,
        mensaje: `Tu reporte ha sido devuelto para correcciones. Observaciones: ${observaciones}`,
        tipo: 'DEVOLUCION'
      });

      return notificacion;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear notificación de devolución');
    }
  }

  // Obtener estadísticas de notificaciones
  async getStats() {
    try {
      const totalNotificaciones = await models.Notificacion.count();
      const notificacionesPorTipo = await models.Notificacion.findAll({
        attributes: [
          'tipo',
          [models.sequelize.fn('COUNT', models.sequelize.col('tipo')), 'count']
        ],
        group: ['tipo']
      });

      const notificacionesLeidas = await models.Notificacion.count({
        where: { leido: true }
      });

      const notificacionesNoLeidas = await models.Notificacion.count({
        where: { leido: false }
      });

      return {
        total: totalNotificaciones,
        porTipo: notificacionesPorTipo,
        leidas: notificacionesLeidas,
        noLeidas: notificacionesNoLeidas
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas de notificaciones');
    }
  }
}

module.exports = NotificacionService;
