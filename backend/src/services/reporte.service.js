import boom from '@hapi/boom';
import { models } from '../db/models/index.js';

class ReporteService {
  // Obtener todos los reportes
  async find() {
    try {
      const reportes = await models.Reporte.findAll({
          include: [
            {
              model: models.User,
              as: 'usuario',
              attributes: ['id', 'nombre', 'apellido', 'email']
            },
            {
              model: models.Actividad,
              as: 'actividad',
              attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin']
            },
            {
              model: models.Actividad,
              as: 'actividades',
              through: { attributes: [] },
              attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin', 'estado']
            }
          ],
          order: [['createdAt', 'DESC']]
        });
      return reportes;
    } catch (error) {
      console.error('Error específico en reporte.service.js:', error);
      throw boom.internal('Error al obtener los reportes');
    }
  }

  // Obtener reportes por docente
  async findByDocente(docenteId, filters = {}) {
    try {
      const whereClause = { usuarioId: docenteId };
      
      // Aplicar filtros adicionales si se proporcionan
      if (filters.estado) whereClause.estado = filters.estado;
      if (filters.actividadId) whereClause.actividadId = filters.actividadId;
      
      const reportes = await models.Reporte.findAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin']
          },
          {
            model: models.Actividad,
            as: 'actividades',
            through: { attributes: [] },
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin', 'estado']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return reportes;
    } catch (error) {
      console.error('Error detallado en findByDocente:', error);
      throw boom.internal(`Error al obtener los reportes del docente: ${error.message}`);
    }
  }

  // Obtener reportes por actividad
  async findByActividad(actividadId) {
    try {
      const reportes = await models.Reporte.findAll({
        where: { actividadId: actividadId },
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener los reportes del periodo');
    }
  }

  // Obtener reportes por estado
  async findByStatus(estado) {
    try {
      const reportes = await models.Reporte.findAll({
        where: { estado },
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener los reportes por estado');
    }
  }

  // Obtener un reporte por ID
  async findOne(id) {
    try {
      const reporte = await models.Reporte.findByPk(id, {
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: models.User,
            as: 'revisadoPor',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin']
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin', 'categoria', 'ubicacion'],
            through: {
              attributes: ['orden', 'observaciones']
            }
          }
        ]
      });

      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      return reporte;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener el reporte');
    }
  }

  // Crear un nuevo reporte
  async create(reporteData) {
    const transaction = await models.sequelize.transaction();
    
    try {
      // Verificar que el usuario existe
      const usuario = await models.User.findByPk(reporteData.usuarioId);
      if (!usuario) {
        throw boom.notFound('Usuario no encontrado');
      }

      // Extraer actividades del reporteData
      const { actividades, ...reporteDataSinActividades } = reporteData;

      // Si hay actividades múltiples, usar la nueva funcionalidad
      if (actividades && Array.isArray(actividades) && actividades.length > 0) {
        // Verificar que todas las actividades existen
        const actividadesIds = actividades.map(act => typeof act === 'object' ? act.id : act);
        const actividadesExistentes = await models.Actividad.findAll({
          where: { id: actividadesIds },
          transaction
        });

        if (actividadesExistentes.length !== actividadesIds.length) {
          throw boom.badRequest('Una o más actividades no existen');
        }

        // Crear el reporte sin actividadId
        const newReporte = await models.Reporte.create({
          ...reporteDataSinActividades,
          actividadId: null // No usar la relación 1:1 antigua
        }, { transaction });

        // Crear las relaciones en la tabla intermedia
        const reporteActividadesData = actividadesIds.map((actividadId, index) => ({
          reporteId: newReporte.id,
          actividadId: actividadId,
          orden: index + 1
        }));

        await models.ReporteActividad.bulkCreate(reporteActividadesData, { transaction });

        await transaction.commit();

        // Retornar con relaciones incluidas
        const reporteWithRelations = await this.findOne(newReporte.id);
        return reporteWithRelations;
      } else {
        // Funcionalidad original para compatibilidad
        if (reporteDataSinActividades.actividadId) {
          const actividad = await models.Actividad.findByPk(reporteDataSinActividades.actividadId);
          if (!actividad) {
            throw boom.notFound('Actividad no encontrada');
          }
        }

        const newReporte = await models.Reporte.create(reporteDataSinActividades, { transaction });
        
        await transaction.commit();
        
        // Retornar con relaciones incluidas
        const reporteWithRelations = await this.findOne(newReporte.id);
        return reporteWithRelations;
      }
    } catch (error) {
      await transaction.rollback();
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear el reporte');
    }
  }

  // Actualizar un reporte
  async update(id, reporteData) {
    const transaction = await models.sequelize.transaction();
    
    try {
      const reporte = await this.findOne(id);

      // Extraer actividades del reporteData
      const { actividades, ...reporteDataSinActividades } = reporteData;

      // Si se está cambiando el estado, actualizar fecha de revisión
      if (reporteDataSinActividades.estado && reporteDataSinActividades.estado !== reporte.estado) {
        if (reporteDataSinActividades.estado === 'revisado' || reporteDataSinActividades.estado === 'aprobado' || reporteDataSinActividades.estado === 'rechazado') {
          reporteDataSinActividades.fechaRevision = new Date();
        }
      }

      // Si se están actualizando las actividades
      if (actividades && Array.isArray(actividades)) {
        // Verificar que todas las actividades existen
        const actividadesIds = actividades.map(act => typeof act === 'object' ? act.id : act);
        const actividadesExistentes = await models.Actividad.findAll({
          where: { id: actividadesIds },
          transaction
        });

        if (actividadesExistentes.length !== actividadesIds.length) {
          throw boom.badRequest('Una o más actividades no existen');
        }

        // Eliminar relaciones existentes
        await models.ReporteActividad.destroy({
          where: { reporteId: id },
          transaction
        });

        // Crear nuevas relaciones
        const reporteActividadesData = actividadesIds.map((actividadId, index) => ({
          reporteId: id,
          actividadId: actividadId,
          orden: index + 1
        }));

        await models.ReporteActividad.bulkCreate(reporteActividadesData, { transaction });

        // Limpiar actividadId si se está usando la nueva funcionalidad
        reporteDataSinActividades.actividadId = null;
      }

      const updatedReporte = await reporte.update(reporteDataSinActividades, { transaction });
      
      await transaction.commit();
      
      // Retornar con relaciones incluidas
      const reporteWithRelations = await this.findOne(id);
      return reporteWithRelations;
    } catch (error) {
      await transaction.rollback();
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar el reporte');
    }
  }

  // Eliminar un reporte
  async delete(id) {
    try {
      const reporte = await this.findOne(id);
      await reporte.destroy();
      return { message: 'Reporte eliminado correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar el reporte');
    }
  }

  // Cambiar estado del reporte
  async changeStatus(id, newStatus, userId, observaciones = null) {
    try {
      const reporte = await this.findOne(id);
      const oldStatus = reporte.estado;

      // Actualizar estado
      await reporte.update({ 
        estado: newStatus,
        comentariosRevision: observaciones || reporte.comentariosRevision
      });

      // Registrar cambio en historial
      await models.HistorialCambio.create({
        id_reporte: id,
        id_usuario_modificador: userId,
        descripcion_cambio: `Estado cambiado de ${oldStatus} a ${newStatus}${observaciones ? ` - ${observaciones}` : ''}`
      });

      // Si se está enviando, actualizar fecha de envío
      if (newStatus === 'EN_REVISION' && oldStatus === 'BORRADOR') {
        await reporte.update({ fecha_envio: new Date() });
      }

      return { 
        message: `Estado del reporte cambiado a ${newStatus}`,
        estado: newStatus
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar el estado del reporte');
    }
  }

  // Obtener estadísticas de reportes
  async getStats() {
    try {
      const totalReportes = await models.Reporte.count();
      const reportesPorEstado = await models.Reporte.findAll({
        attributes: [
          'estado',
          [models.sequelize.fn('COUNT', models.sequelize.col('estado')), 'count']
        ],
        group: ['estado']
      });

      const reportesPorTipo = await models.Reporte.findAll({
        attributes: [
          'tipo',
          [models.sequelize.fn('COUNT', models.sequelize.col('tipo')), 'count']
        ],
        group: ['tipo']
      });

      return {
        total: totalReportes,
        porEstado: reportesPorEstado,
        porTipo: reportesPorTipo
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas de reportes');
    }
  }

  // Obtener reportes pendientes de revisión
  async findPendingReview() {
    try {
      const reportes = await models.Reporte.findAll({
        where: { estado: 'EN_REVISION' },
        include: [
          {
            model: models.User,
            as: 'docente',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['fecha_envio', 'ASC']]
      });
      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener reportes pendientes de revisión');
    }
  }

  // Obtener historial de reportes de un docente
  async getReportHistory(docenteId, filters = {}) {
    try {
      const whereClause = { usuarioId: docenteId };
      
      // Aplicar filtros adicionales si se proporcionan
      if (filters.estado) whereClause.estado = filters.estado;
      if (filters.tipo) whereClause.tipo = filters.tipo;
      if (filters.fechaInicio) {
        whereClause.createdAt = {
          ...whereClause.createdAt,
          [models.sequelize.Op.gte]: filters.fechaInicio
        };
      }
      if (filters.fechaFin) {
        whereClause.createdAt = {
          ...whereClause.createdAt,
          [models.sequelize.Op.lte]: filters.fechaFin
        };
      }
      
      const reportes = await models.Reporte.findAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return reportes;
    } catch (error) {
      console.error('Error detallado en getReportHistory:', error);
      throw boom.internal(`Error al obtener el historial de reportes: ${error.message}`);
    }
  }
}

export default ReporteService;
