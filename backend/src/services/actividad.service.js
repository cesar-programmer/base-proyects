const boom = require('@hapi/boom');
const { models } = require('../db/models');

class ActividadService {
  // Obtener todas las actividades
  async find() {
    try {
      const actividades = await models.Actividad.findAll({
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id_reporte', 'tipo', 'estado', 'semestre']
          },
          {
            model: models.CatalogoActividad,
            as: 'catalogo',
            attributes: ['id_catalogo', 'titulo', 'descripcion', 'horas_estimadas']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener las actividades');
    }
  }

  // Obtener actividades por reporte
  async findByReporte(reporteId) {
    try {
      const actividades = await models.Actividad.findAll({
        where: { id_reporte: reporteId },
        include: [
          {
            model: models.CatalogoActividad,
            as: 'catalogo',
            attributes: ['id_catalogo', 'titulo', 'descripcion', 'horas_estimadas']
          },
          {
            model: models.Archivo,
            as: 'archivos',
            attributes: ['id_archivo', 'nombre_original', 'tipo_mime', 'fecha_subida']
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
            attributes: ['id_reporte', 'tipo', 'estado', 'semestre']
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
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id_reporte', 'tipo', 'estado', 'semestre']
          },
          {
            model: models.CatalogoActividad,
            as: 'catalogo',
            attributes: ['id_catalogo', 'titulo', 'descripcion', 'horas_estimadas']
          },
          {
            model: models.Archivo,
            as: 'archivos',
            attributes: ['id_archivo', 'nombre_original', 'tipo_mime', 'fecha_subida']
          }
        ]
      });

      if (!actividad) {
        throw boom.notFound('Actividad no encontrada');
      }

      return actividad;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener la actividad');
    }
  }

  // Crear una nueva actividad
  async create(actividadData) {
    try {
      // Verificar que el reporte existe
      const reporte = await models.Reporte.findByPk(actividadData.id_reporte);
      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      // Si es del catálogo, verificar que existe
      if (actividadData.id_catalogo) {
        const catalogo = await models.CatalogoActividad.findByPk(actividadData.id_catalogo);
        if (!catalogo) {
          throw boom.notFound('Actividad del catálogo no encontrada');
        }
      }

      const newActividad = await models.Actividad.create(actividadData);
      
      // Retornar con relaciones incluidas
      const actividadWithRelations = await this.findOne(newActividad.id_actividad);
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

      // Si se está cambiando el reporte, verificar que existe
      if (actividadData.id_reporte && actividadData.id_reporte !== actividad.id_reporte) {
        const reporte = await models.Reporte.findByPk(actividadData.id_reporte);
        if (!reporte) {
          throw boom.notFound('Reporte no encontrado');
        }
      }

      // Si se está cambiando el catálogo, verificar que existe
      if (actividadData.id_catalogo && actividadData.id_catalogo !== actividad.id_catalogo) {
        const catalogo = await models.CatalogoActividad.findByPk(actividadData.id_catalogo);
        if (!catalogo) {
          throw boom.notFound('Actividad del catálogo no encontrada');
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

  // Agregar actividad desde el catálogo
  async addFromCatalog(reporteId, catalogoId) {
    try {
      // Verificar que el reporte existe
      const reporte = await models.Reporte.findByPk(reporteId);
      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      // Obtener la actividad del catálogo
      const catalogo = await models.CatalogoActividad.findByPk(catalogoId);
      if (!catalogo) {
        throw boom.notFound('Actividad del catálogo no encontrada');
      }

      // Verificar que no esté ya agregada
      const existingActividad = await models.Actividad.findOne({
        where: {
          id_reporte: reporteId,
          id_catalogo: catalogoId
        }
      });

      if (existingActividad) {
        throw boom.conflict('Esta actividad ya está agregada al reporte');
      }

      // Crear la actividad
      const newActividad = await models.Actividad.create({
        id_reporte: reporteId,
        id_catalogo: catalogoId,
        titulo: catalogo.titulo,
        descripcion: catalogo.descripcion,
        categoria: catalogo.categoria,
        horas_estimadas: catalogo.horas_estimadas,
        es_personalizada: false
      });

      // Retornar con relaciones incluidas
      const actividadWithRelations = await this.findOne(newActividad.id_actividad);
      return actividadWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al agregar actividad desde el catálogo');
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
}

module.exports = ActividadService;
