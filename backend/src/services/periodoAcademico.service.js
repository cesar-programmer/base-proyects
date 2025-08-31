import { models } from '../db/models/index.js';
import Boom from '@hapi/boom';
import { Op } from 'sequelize';

class PeriodoAcademicoService {
  constructor() {
    this.model = models.PeriodoAcademico;
  }

  async findAll() {
    try {
      const periodos = await this.model.findAll({
        order: [['fechaInicio', 'DESC']]
      });
      return periodos;
    } catch (error) {
      throw Boom.internal('Error al obtener períodos académicos', error);
    }
  }

  async findById(id) {
    try {
      const periodo = await this.model.findByPk(id);
      if (!periodo) {
        throw Boom.notFound('Período académico no encontrado');
      }
      return periodo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al obtener período académico', error);
    }
  }

  async findActive() {
    try {
      const periodo = await this.model.findOne({
        where: { activo: true }
      });
      return periodo;
    } catch (error) {
      throw Boom.internal('Error al obtener período académico activo', error);
    }
  }

  async findByDateRange(fechaInicio, fechaFin) {
    try {
      const periodos = await this.model.findAll({
        where: {
          [Op.or]: [
            {
              fecha_inicio: {
                [Op.between]: [fechaInicio, fechaFin]
              }
            },
            {
              fecha_fin: {
                [Op.between]: [fechaInicio, fechaFin]
              }
            },
            {
              [Op.and]: [
                { fecha_inicio: { [Op.lte]: fechaInicio } },
                { fecha_fin: { [Op.gte]: fechaFin } }
              ]
            }
          ]
        },
        order: [['fecha_inicio', 'ASC']]
      });
      return periodos;
    } catch (error) {
      throw Boom.internal('Error al buscar períodos por rango de fechas', error);
    }
  }

  async create(data) {
    try {
      // Si el nuevo período se marca como activo, desactivar otros períodos activos
      if (data.activo) {
        await this.model.update(
          { activo: false },
          { where: { activo: true } }
        );
      }

      // Verificar solapamiento de fechas
      const overlappingPeriods = await this.findByDateRange(data.fecha_inicio, data.fecha_fin);
      if (overlappingPeriods.length > 0) {
        throw Boom.conflict('Las fechas del período se solapan con otro período existente');
      }

      const periodo = await this.model.create(data);
      return periodo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al crear período académico', error);
    }
  }

  async update(id, data) {
    try {
      const periodo = await this.findById(id);
      
      // Si se está activando este período, desactivar otros
      if (data.activo && !periodo.activo) {
        await this.model.update(
          { activo: false },
          { where: { activo: true, id: { [Op.ne]: id } } }
        );
      }

      // Si se están actualizando las fechas, verificar solapamiento
      if (data.fecha_inicio || data.fecha_fin) {
        const fechaInicio = data.fecha_inicio || periodo.fecha_inicio;
        const fechaFin = data.fecha_fin || periodo.fecha_fin;
        
        const overlappingPeriods = await this.findByDateRange(fechaInicio, fechaFin);
        const filteredOverlapping = overlappingPeriods.filter(p => p.id !== id);
        
        if (filteredOverlapping.length > 0) {
          throw Boom.conflict('Las fechas del período se solapan con otro período existente');
        }
      }

      const updatedPeriodo = await periodo.update(data);
      return updatedPeriodo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al actualizar período académico', error);
    }
  }

  async delete(id) {
    try {
      const periodo = await this.findById(id);
      
      // No permitir eliminar el período activo
      if (periodo.activo) {
        throw Boom.conflict('No se puede eliminar el período académico activo');
      }

      // Verificar si hay reportes asociados a este período
      const reportesCount = await models.Reporte.count({
        where: { id_periodo_academico: id }
      });
      
      if (reportesCount > 0) {
        throw Boom.conflict('No se puede eliminar el período porque tiene reportes asociados');
      }

      await periodo.destroy();
      return { message: 'Período académico eliminado exitosamente' };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al eliminar período académico', error);
    }
  }

  async activate(id) {
    try {
      // Desactivar todos los períodos
      await this.model.update(
        { activo: false },
        { where: { activo: true } }
      );

      // Activar el período seleccionado
      const periodo = await this.findById(id);
      const updatedPeriodo = await periodo.update({ activo: true });
      return updatedPeriodo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al activar período académico', error);
    }
  }
}

export default PeriodoAcademicoService;