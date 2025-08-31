import { models } from '../db/models/index.js';
import Boom from '@hapi/boom';
import { Op } from 'sequelize';

class HistorialCambioService {
  constructor() {
    this.model = models.HistorialCambio;
  }

  async findAll(filters = {}) {
    try {
      const where = {};
      
      if (filters.id_reporte) {
        where.id_reporte = filters.id_reporte;
      }
      
      if (filters.id_usuario) {
        where.id_usuario = filters.id_usuario;
      }
      
      if (filters.accion) {
        where.accion = filters.accion;
      }
      
      if (filters.fecha_desde) {
        where.created_at = {
          [Op.gte]: filters.fecha_desde
        };
      }
      
      if (filters.fecha_hasta) {
        where.created_at = {
          ...where.created_at,
          [Op.lte]: filters.fecha_hasta
        };
      }

      const historial = await this.model.findAll({
        where,
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id', 'titulo']
          },
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      return historial;
    } catch (error) {
      throw Boom.internal('Error al obtener historial de cambios', error);
    }
  }

  async findById(id) {
    try {
      const cambio = await this.model.findByPk(id, {
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id', 'titulo']
          },
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      });
      if (!cambio) {
        throw Boom.notFound('Registro de historial no encontrado');
      }
      return cambio;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al obtener registro de historial', error);
    }
  }

  async findByReport(idReporte, limit = 50) {
    try {
      const historial = await this.model.findAll({
        where: { id_reporte: idReporte },
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ],
        order: [['created_at', 'DESC']],
        limit
      });
      return historial;
    } catch (error) {
      throw Boom.internal('Error al obtener historial por reporte', error);
    }
  }

  async findByUser(idUsuario, limit = 50) {
    try {
      const historial = await this.model.findAll({
        where: { id_usuario: idUsuario },
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id', 'titulo']
          }
        ],
        order: [['created_at', 'DESC']],
        limit
      });
      return historial;
    } catch (error) {
      throw Boom.internal('Error al obtener historial por usuario', error);
    }
  }

  async create(data) {
    try {
      // Verificar que el reporte existe
      const reporte = await models.Reporte.findByPk(data.id_reporte);
      if (!reporte) {
        throw Boom.notFound('Reporte no encontrado');
      }

      // Verificar que el usuario existe
      const usuario = await models.User.findByPk(data.id_usuario);
      if (!usuario) {
        throw Boom.notFound('Usuario no encontrado');
      }

      const cambio = await this.model.create(data);
      
      // Retornar el cambio con las relaciones incluidas
      return await this.findById(cambio.id);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al crear registro de historial', error);
    }
  }

  async logChange(idReporte, idUsuario, accion, descripcion, valoresAnteriores = null, valoresNuevos = null) {
    try {
      const data = {
        id_reporte: idReporte,
        id_usuario: idUsuario,
        accion,
        descripcion,
        valores_anteriores: valoresAnteriores,
        valores_nuevos: valoresNuevos
      };
      
      return await this.create(data);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al registrar cambio', error);
    }
  }

  async delete(id) {
    try {
      const cambio = await this.findById(id);
      await cambio.destroy();
      return { message: 'Registro de historial eliminado exitosamente' };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al eliminar registro de historial', error);
    }
  }

  async deleteOldRecords(daysOld = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const deletedCount = await this.model.destroy({
        where: {
          created_at: {
            [Op.lt]: cutoffDate
          }
        }
      });
      
      return { 
        message: `${deletedCount} registros antiguos eliminados exitosamente`,
        deletedCount
      };
    } catch (error) {
      throw Boom.internal('Error al eliminar registros antiguos', error);
    }
  }

  async getStatsByUser(idUsuario) {
    try {
      const stats = await this.model.findAll({
        where: { id_usuario: idUsuario },
        attributes: [
          'accion',
          [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'total']
        ],
        group: ['accion'],
        raw: true
      });
      
      return stats;
    } catch (error) {
      throw Boom.internal('Error al obtener estadísticas por usuario', error);
    }
  }

  async getStatsByDate(fechaInicio, fechaFin) {
    try {
      const stats = await this.model.findAll({
        where: {
          created_at: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        attributes: [
          [models.sequelize.fn('DATE', models.sequelize.col('created_at')), 'fecha'],
          'accion',
          [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'total']
        ],
        group: [models.sequelize.fn('DATE', models.sequelize.col('created_at')), 'accion'],
        order: [[models.sequelize.fn('DATE', models.sequelize.col('created_at')), 'ASC']],
        raw: true
      });
      
      return stats;
    } catch (error) {
      throw Boom.internal('Error al obtener estadísticas por fecha', error);
    }
  }
}

export default HistorialCambioService;