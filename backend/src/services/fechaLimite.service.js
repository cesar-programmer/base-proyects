const boom = require('@hapi/boom');
const { models } = require('../db/models');

class FechaLimiteService {
  // Obtener todas las fechas límite
  async find() {
    try {
      const fechasLimite = await models.FechaLimite.findAll({
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre', 'activo']
          }
        ],
        order: [['fecha_limite', 'ASC']]
      });
      return fechasLimite;
    } catch (error) {
      throw boom.internal('Error al obtener las fechas límite');
    }
  }

  // Obtener fechas límite por periodo
  async findByPeriod(periodId) {
    try {
      const fechasLimite = await models.FechaLimite.findAll({
        where: { id_periodo: periodId },
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre', 'activo']
          }
        ],
        order: [['fecha_limite', 'ASC']]
      });
      return fechasLimite;
    } catch (error) {
      throw boom.internal('Error al obtener las fechas límite del periodo');
    }
  }

  // Obtener fechas límite activas
  async findActive() {
    try {
      const fechasLimite = await models.FechaLimite.findAll({
        where: { activo: true },
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            where: { activo: true },
            attributes: ['id_periodo', 'nombre']
          }
        ],
        order: [['fecha_limite', 'ASC']]
      });
      return fechasLimite;
    } catch (error) {
      throw boom.internal('Error al obtener las fechas límite activas');
    }
  }

  // Obtener una fecha límite por ID
  async findOne(id) {
    try {
      const fechaLimite = await models.FechaLimite.findByPk(id, {
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre', 'activo']
          }
        ]
      });

      if (!fechaLimite) {
        throw boom.notFound('Fecha límite no encontrada');
      }

      return fechaLimite;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener la fecha límite');
    }
  }

  // Crear una nueva fecha límite
  async create(fechaLimiteData) {
    try {
      // Verificar que el periodo existe
      const periodo = await models.PeriodoAcademico.findByPk(fechaLimiteData.id_periodo);
      if (!periodo) {
        throw boom.notFound('Periodo académico no encontrado');
      }

      const newFechaLimite = await models.FechaLimite.create(fechaLimiteData);
      
      // Retornar con el periodo incluido
      const fechaLimiteWithPeriod = await this.findOne(newFechaLimite.id_fecha_limite);
      return fechaLimiteWithPeriod;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear la fecha límite');
    }
  }

  // Actualizar una fecha límite
  async update(id, fechaLimiteData) {
    try {
      const fechaLimite = await this.findOne(id);

      // Si se está cambiando el periodo, verificar que existe
      if (fechaLimiteData.id_periodo && fechaLimiteData.id_periodo !== fechaLimite.id_periodo) {
        const periodo = await models.PeriodoAcademico.findByPk(fechaLimiteData.id_periodo);
        if (!periodo) {
          throw boom.notFound('Periodo académico no encontrado');
        }
      }

      const updatedFechaLimite = await fechaLimite.update(fechaLimiteData);
      
      // Retornar con el periodo incluido
      const fechaLimiteWithPeriod = await this.findOne(id);
      return fechaLimiteWithPeriod;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar la fecha límite');
    }
  }

  // Eliminar una fecha límite
  async delete(id) {
    try {
      const fechaLimite = await this.findOne(id);
      await fechaLimite.destroy();
      return { message: 'Fecha límite eliminada correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar la fecha límite');
    }
  }

  // Cambiar estado activo/inactivo
  async toggleStatus(id) {
    try {
      const fechaLimite = await this.findOne(id);
      const newStatus = !fechaLimite.activo;
      await fechaLimite.update({ activo: newStatus });
      
      return { 
        message: `Fecha límite ${newStatus ? 'activada' : 'desactivada'} correctamente`,
        activo: newStatus
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar el estado de la fecha límite');
    }
  }

  // Obtener fechas límite próximas a vencer
  async findUpcoming(days = 7) {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const fechasLimite = await models.FechaLimite.findAll({
        where: {
          activo: true,
          fecha_limite: {
            [models.sequelize.Op.between]: [today, futureDate]
          }
        },
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            where: { activo: true },
            attributes: ['id_periodo', 'nombre']
          }
        ],
        order: [['fecha_limite', 'ASC']]
      });

      return fechasLimite;
    } catch (error) {
      throw boom.internal('Error al obtener las fechas límite próximas');
    }
  }

  // Obtener fechas límite vencidas
  async findExpired() {
    try {
      const today = new Date();

      const fechasLimite = await models.FechaLimite.findAll({
        where: {
          activo: true,
          fecha_limite: {
            [models.sequelize.Op.lt]: today
          }
        },
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['id_periodo', 'nombre']
          }
        ],
        order: [['fecha_limite', 'DESC']]
      });

      return fechasLimite;
    } catch (error) {
      throw boom.internal('Error al obtener las fechas límite vencidas');
    }
  }

  // Obtener fechas límite por categoría
  async findByCategory(categoria) {
    try {
      const fechasLimite = await models.FechaLimite.findAll({
        where: { 
          categoria,
          activo: true
        },
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            where: { activo: true },
            attributes: ['id_periodo', 'nombre']
          }
        ],
        order: [['fecha_limite', 'ASC']]
      });

      return fechasLimite;
    } catch (error) {
      throw boom.internal('Error al obtener las fechas límite por categoría');
    }
  }
}

module.exports = FechaLimiteService;
