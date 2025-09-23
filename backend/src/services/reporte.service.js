import boom from '@hapi/boom';
import { models } from '../db/models/index.js';
import { Op } from 'sequelize';

class ReporteService {
  // Obtener todos los reportes con filtros y paginación
  async find(options = {}) {
    try {
      const { page = 1, limit = 10, estado, actividadId, usuarioId } = options;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (estado) whereClause.estado = estado;
      if (actividadId) whereClause.actividadId = actividadId;
      if (usuarioId) whereClause.usuarioId = usuarioId;

      const reportes = await models.Reporte.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: models.User,
            as: 'revisadoPor',
            attributes: ['id', 'nombre', 'email'],
            required: false
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id', 'titulo', 'descripcion'],
            required: false,
            through: { attributes: [] }
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        reportes: reportes.rows,
        total: reportes.count,
        totalPages: Math.ceil(reportes.count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw boom.internal('Error al obtener los reportes');
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
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: models.User,
            as: 'revisadoPor',
            attributes: ['id', 'nombre', 'email'],
            required: false
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id', 'titulo', 'descripcion'],
            required: false,
            through: { attributes: [] } // Excluir atributos de la tabla intermedia
          },
          {
            model: models.Archivo,
            as: 'archivos',
            attributes: ['id', 'nombre_original', 'nombre_almacenado', 'ruta_almacenamiento', 'tipo_mime'],
            required: false
          }
        ]
      });

      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      return reporte;
    } catch (error) {
      console.log('Error específico en findOne:', error);
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener el reporte');
    }
  }

  // Crear un nuevo reporte
  async create(reporteData, archivos = []) {
    try {
      console.log('Datos del reporte antes de crear:', reporteData);
      const newReporte = await models.Reporte.create(reporteData);

      // Si hay archivos, asociarlos al reporte
      if (archivos && archivos.length > 0) {
        for (const archivo of archivos) {
          await models.Archivo.create({
            ...archivo,
            reporteId: newReporte.id
          });
        }
      }

      // Retornar el reporte con sus relaciones
      return await this.findOne(newReporte.id);
    } catch (error) {
      console.log('Error específico en create reporte:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      if (boom.isBoom(error)) throw error;
      
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message).join(', ');
        throw boom.badRequest(`Error de validación: ${messages}`);
      }
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw boom.badRequest('Error de referencia: Verifique que los IDs de usuario y actividad sean válidos');
      }
      
      throw boom.internal(`Error al crear el reporte: ${error.message}`);
    }
  }

  // Actualizar un reporte
  async update(id, reporteData, archivos = []) {
    try {
      const reporte = await this.findOne(id);
      
      await reporte.update(reporteData);

      // Si hay archivos nuevos, agregarlos
      if (archivos && archivos.length > 0) {
        for (const archivo of archivos) {
          await models.Archivo.create({
            ...archivo,
            reporteId: id
          });
        }
      }

      // Retornar el reporte actualizado
      return await this.findOne(id);
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar el reporte');
    }
  }

  // Eliminar un reporte
  async delete(id) {
    try {
      const reporte = await this.findOne(id);
      
      // Eliminar archivos asociados primero
      await models.Archivo.destroy({
        where: { reporteId: id }
      });
      
      await reporte.destroy();
      
      return { message: 'Reporte eliminado exitosamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar el reporte');
    }
  }

  // Eliminar archivo de un reporte
  async removeArchivo(reporteId, archivoId, usuarioId) {
    try {
      const archivo = await models.Archivo.findOne({
        where: {
          id: archivoId,
          reporteId: reporteId
        }
      });

      if (!archivo) {
        throw boom.notFound('Archivo no encontrado');
      }

      await archivo.destroy();
      
      return { message: 'Archivo eliminado exitosamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar el archivo');
    }
  }

  // Obtener reportes por docente
  async findByDocente(docenteId, filters = {}) {
    try {
      const whereClause = { usuarioId: parseInt(docenteId) };
      
      if (filters.estado) whereClause.estado = filters.estado;
      if (filters.actividadId) whereClause.actividadId = filters.actividadId;

      const reportes = await models.Reporte.findAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener reportes por docente');
    }
  }

  // Obtener reportes por actividad/período
  async findByActividad(actividadId, filters = {}) {
    try {
      const whereClause = { actividadId: parseInt(actividadId) };
      
      if (filters.estado) whereClause.estado = filters.estado;

      const reportes = await models.Reporte.findAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
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
      throw boom.internal('Error al obtener reportes por actividad');
    }
  }

  // Cambiar estado del reporte
  async changeStatus(id, estado, comentariosRevision = null) {
    try {
      const reporte = await this.findOne(id);
      
      const updateData = { 
        estado,
        fechaRevision: new Date()
      };
      
      if (comentariosRevision) {
        updateData.comentariosRevision = comentariosRevision;
      }
      
      await reporte.update(updateData);
      
      return await this.findOne(id);
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar el estado del reporte');
    }
  }
}

export default ReporteService;