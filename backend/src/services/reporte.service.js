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
            as: 'docente',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          },
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre', 'activo']
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id_actividad', 'titulo', 'categoria', 'horas_estimadas']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener los reportes');
    }
  }

  // Obtener reportes por docente
  async findByDocente(docenteId) {
    try {
      const reportes = await models.Reporte.findAll({
        where: { id_docente: docenteId },
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre', 'activo']
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id_actividad', 'titulo', 'categoria', 'horas_estimadas', 'estado_realizado']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener los reportes del docente');
    }
  }

  // Obtener reportes por periodo
  async findByPeriod(periodId) {
    try {
      const reportes = await models.Reporte.findAll({
        where: { id_periodo: periodId },
        include: [
          {
            model: models.User,
            as: 'docente',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id_actividad', 'titulo', 'categoria', 'horas_estimadas']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
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
            as: 'docente',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          },
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
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
            as: 'docente',
            attributes: ['id_usuario', 'nombre_completo', 'email']
          },
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre', 'activo']
          },
          {
            model: models.Actividad,
            as: 'actividades',
            include: [
              {
                model: models.CatalogoActividad,
                as: 'catalogo',
                attributes: ['id_catalogo', 'titulo', 'descripcion']
              },
              {
                model: models.Archivo,
                as: 'archivos',
                attributes: ['id_archivo', 'nombre_original', 'tipo_mime']
              }
            ]
          },
          {
            model: models.HistorialCambio,
            as: 'historial_cambios',
            include: [
              {
                model: models.User,
                as: 'usuario_modificador',
                attributes: ['id_usuario', 'nombre_completo']
              }
            ],
            order: [['fecha_cambio', 'DESC']]
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
    try {
      // Verificar que el docente existe
      const docente = await models.User.findByPk(reporteData.id_docente);
      if (!docente) {
        throw boom.notFound('Docente no encontrado');
      }

      // Verificar que el periodo existe
      const periodo = await models.PeriodoAcademico.findByPk(reporteData.id_periodo);
      if (!periodo) {
        throw boom.notFound('Periodo académico no encontrado');
      }

      const newReporte = await models.Reporte.create(reporteData);
      
      // Retornar con relaciones incluidas
      const reporteWithRelations = await this.findOne(newReporte.id_reporte);
      return reporteWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear el reporte');
    }
  }

  // Actualizar un reporte
  async update(id, reporteData) {
    try {
      const reporte = await this.findOne(id);

      // Si se está cambiando el estado, registrar en historial
      if (reporteData.estado && reporteData.estado !== reporte.estado) {
        await models.HistorialCambio.create({
          id_reporte: id,
          id_usuario_modificador: reporteData.id_usuario_modificador || reporte.id_docente,
          descripcion_cambio: `Estado cambiado de ${reporte.estado} a ${reporteData.estado}`
        });
      }

      const updatedReporte = await reporte.update(reporteData);
      
      // Retornar con relaciones incluidas
      const reporteWithRelations = await this.findOne(id);
      return reporteWithRelations;
    } catch (error) {
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
        observaciones_admin: observaciones || reporte.observaciones_admin
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
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre']
          }
        ],
        order: [['fecha_envio', 'ASC']]
      });
      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener reportes pendientes de revisión');
    }
  }
}

export default ReporteService;
