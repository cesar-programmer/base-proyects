const boom = require('@hapi/boom');
const { models } = require('../db/models');

class CatalogoActividadService {
  // Obtener todas las actividades del catálogo
  async find() {
    try {
      const actividades = await models.CatalogoActividad.findAll({
        where: { activo: true },
        order: [
          ['categoria', 'ASC'],
          ['titulo', 'ASC']
        ]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener el catálogo de actividades');
    }
  }

  // Obtener actividades por categoría
  async findByCategory(categoria) {
    try {
      const actividades = await models.CatalogoActividad.findAll({
        where: {
          categoria,
          activo: true
        },
        order: [['titulo', 'ASC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener actividades por categoría');
    }
  }

  // Obtener una actividad del catálogo por ID
  async findOne(id) {
    try {
      const actividad = await models.CatalogoActividad.findByPk(id);

      if (!actividad) {
        throw boom.notFound('Actividad del catálogo no encontrada');
      }

      return actividad;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener la actividad del catálogo');
    }
  }

  // Crear una nueva actividad en el catálogo
  async create(actividadData) {
    try {
      const newActividad = await models.CatalogoActividad.create(actividadData);
      return newActividad;
    } catch (error) {
      throw boom.internal('Error al crear la actividad en el catálogo');
    }
  }

  // Actualizar una actividad del catálogo
  async update(id, actividadData) {
    try {
      const actividad = await this.findOne(id);
      const updatedActividad = await actividad.update(actividadData);
      return updatedActividad;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar la actividad del catálogo');
    }
  }

  // Eliminar una actividad del catálogo
  async delete(id) {
    try {
      const actividad = await this.findOne(id);
      await actividad.destroy();
      return { message: 'Actividad del catálogo eliminada correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar la actividad del catálogo');
    }
  }

  // Cambiar estado activo/inactivo
  async toggleStatus(id) {
    try {
      const actividad = await this.findOne(id);
      const newStatus = !actividad.activo;
      await actividad.update({ activo: newStatus });

      return {
        message: `Actividad ${newStatus ? 'activada' : 'desactivada'} correctamente`,
        activo: newStatus
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar el estado de la actividad');
    }
  }

  // Obtener estadísticas del catálogo
  async getStats() {
    try {
      const totalActividades = await models.CatalogoActividad.count();
      const actividadesActivas = await models.CatalogoActividad.count({
        where: { activo: true }
      });
      const actividadesPorCategoria = await models.CatalogoActividad.findAll({
        attributes: [
          'categoria',
          [models.sequelize.fn('COUNT', models.sequelize.col('categoria')), 'count']
        ],
        where: { activo: true },
        group: ['categoria']
      });

      return {
        total: totalActividades,
        activas: actividadesActivas,
        porCategoria: actividadesPorCategoria
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas del catálogo');
    }
  }

  // Buscar actividades por texto
  async search(searchTerm) {
    try {
      const actividades = await models.CatalogoActividad.findAll({
        where: {
          activo: true,
          [models.sequelize.Op.or]: [
            {
              titulo: {
                [models.sequelize.Op.like]: `%${searchTerm}%`
              }
            },
            {
              descripcion: {
                [models.sequelize.Op.like]: `%${searchTerm}%`
              }
            }
          ]
        },
        order: [['categoria', 'ASC'], ['titulo', 'ASC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al buscar actividades en el catálogo');
    }
  }

  // Obtener actividades más utilizadas
  async getMostUsed(limit = 10) {
    try {
      const actividades = await models.CatalogoActividad.findAll({
        attributes: [
          'id_catalogo',
          'titulo',
          'categoria',
          'horas_estimadas',
          [models.sequelize.fn('COUNT', models.sequelize.col('Actividades.id_actividad')), 'uso_count']
        ],
        include: [
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: []
          }
        ],
        where: { activo: true },
        group: ['CatalogoActividad.id_catalogo'],
        order: [[models.sequelize.literal('uso_count'), 'DESC']],
        limit
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener actividades más utilizadas');
    }
  }
}

module.exports = CatalogoActividadService;
