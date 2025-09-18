import boom from '@hapi/boom';
import { models } from '../db/models/index.js';

class ActividadService {
  // Obtener todas las actividades
  async find() {
    try {
      const actividades = await models.Actividad.findAll({
        include: [
          {
            association: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            association: 'periodoAcademico',
            attributes: ['id', 'nombre', 'fechaInicio', 'fechaFin']
          }
        ]
      });
      return actividades;
    } catch (error) {
      throw boom.badImplementation('Error al obtener las actividades', error);
    }
  }

  // Obtener actividades por reporte
  async findByReporte(reporteId) {
    try {
      const actividades = await models.Actividad.findAll({
        where: { reporteId: reporteId },
        include: [
          {
            model: models.CatalogoActividad,
            as: 'catalogo',
            attributes: ['id', 'titulo', 'descripcion', 'horas_estimadas']
          },
          {
            model: models.Archivo,
            as: 'archivos',
            attributes: ['id', 'nombre_original', 'tipo_mime', 'fecha_subida']
          }
        ],
        order: [['categoria', 'ASC'], ['titulo', 'ASC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener las actividades del reporte');
    }
  }

  // Obtener actividades por categoría
  async findByCategory(categoria) {
    try {
      const actividades = await models.Actividad.findAll({
        where: { categoria },
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id', 'tipo', 'estado', 'semestre']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener las actividades por categoría');
    }
  }

  // Obtener una actividad por ID
  async findOne(id) {
    try {
      const actividad = await models.Actividad.findByPk(id, {
        include: [
          {
            association: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            association: 'periodoAcademico',
            attributes: ['id', 'nombre', 'fechaInicio', 'fechaFin']
          }
        ]
      });
      if (!actividad) {
        throw boom.notFound('Actividad no encontrada');
      }
      return actividad;
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      throw boom.badImplementation('Error al obtener la actividad', error);
    }
  }

  // Crear una nueva actividad
  async create(actividadData) {
    try {
      // Verificar que el usuario existe
      const usuario = await models.User.findByPk(actividadData.usuarioId);
      if (!usuario) {
        throw boom.notFound('Usuario no encontrado');
      }

      // Verificar que el periodo académico existe
      const periodo = await models.PeriodoAcademico.findByPk(actividadData.periodoAcademicoId);
      if (!periodo) {
        throw boom.notFound('Periodo académico no encontrado');
      }

      const newActividad = await models.Actividad.create(actividadData);
      
      // Retornar con relaciones incluidas
      const actividadWithRelations = await this.findOne(newActividad.id);
      return actividadWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear la actividad');
    }
  }

  // Actualizar una actividad
  async update(id, actividadData) {
    try {
      const actividad = await this.findOne(id);

      // Si se está cambiando el usuario, verificar que existe
      if (actividadData.usuarioId && actividadData.usuarioId !== actividad.usuarioId) {
        const usuario = await models.User.findByPk(actividadData.usuarioId);
        if (!usuario) {
          throw boom.notFound('Usuario no encontrado');
        }
      }

      // Si se está cambiando el periodo académico, verificar que existe
      if (actividadData.periodoAcademicoId && actividadData.periodoAcademicoId !== actividad.periodoAcademicoId) {
        const periodo = await models.PeriodoAcademico.findByPk(actividadData.periodoAcademicoId);
        if (!periodo) {
          throw boom.notFound('Periodo académico no encontrado');
        }
      }

      const updatedActividad = await actividad.update(actividadData);
      
      // Retornar con relaciones incluidas
      const actividadWithRelations = await this.findOne(id);
      return actividadWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar la actividad');
    }
  }

  // Eliminar una actividad
  async delete(id) {
    try {
      const actividad = await this.findOne(id);
      await actividad.destroy();
      return { message: 'Actividad eliminada correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar la actividad');
    }
  }



  // Obtener estadísticas de actividades por categoría
  async getStatsByCategory() {
    try {
      const stats = await models.Actividad.findAll({
        attributes: [
          'categoria',
          [models.sequelize.fn('COUNT', models.sequelize.col('categoria')), 'count'],
          [models.sequelize.fn('SUM', models.sequelize.col('horas_estimadas')), 'total_horas']
        ],
        group: ['categoria']
      });

      return stats;
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas por categoría');
    }
  }

  // Obtener actividades por estado de realización
  async findByRealizationStatus(estado) {
    try {
      const actividades = await models.Actividad.findAll({
        where: { estado_realizado: estado },
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id_reporte', 'tipo', 'estado', 'semestre']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener actividades por estado de realización');
    }
  }

  // Actualizar estado de realización
  async updateRealizationStatus(id, estado) {
    try {
      const actividad = await this.findOne(id);
      await actividad.update({ estado_realizado: estado });
      
      return { 
        message: `Estado de realización actualizado a ${estado}`,
        estado_realizado: estado
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar estado de realización');
    }
  }

  // Aprobar actividad
  async approve(id, comentarios = '') {
    try {
      const actividad = await this.findOne(id);
      await actividad.update({ 
        estado_realizado: 'aprobada',
        comentarios_revision: comentarios,
        fecha_revision: new Date()
      });
      
      return {
        message: 'Actividad aprobada exitosamente',
        data: actividad
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al aprobar la actividad');
    }
  }

  // Rechazar actividad
  async reject(id, razon) {
    try {
      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón del rechazo es requerida');
      }
      
      const actividad = await this.findOne(id);
      await actividad.update({ 
        estado_realizado: 'rechazada',
        comentarios_revision: razon,
        fecha_revision: new Date()
      });
      
      return {
        message: 'Actividad rechazada exitosamente',
        data: actividad
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al rechazar la actividad');
    }
  }
}

export default ActividadService;
