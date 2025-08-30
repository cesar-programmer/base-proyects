const boom = require('@hapi/boom');
const { ActividadService } = require('../services');

const actividadService = new ActividadService();

class ActividadController {
  // Obtener todas las actividades
  async getActividades(req, res, next) {
    try {
      const { page = 1, limit = 10, categoria, estado_realizado, id_reporte } = req.query;
      const filters = {};
      
      if (categoria) filters.categoria = categoria;
      if (estado_realizado) filters.estado_realizado = estado_realizado;
      if (id_reporte) filters.id_reporte = parseInt(id_reporte);

      const actividades = await actividadService.find({
        page: parseInt(page),
        limit: parseInt(limit),
        ...filters
      });

      res.json({
        message: 'Actividades obtenidas exitosamente',
        data: actividades
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener actividad por ID
  async getActividad(req, res, next) {
    try {
      const { id } = req.params;
      const actividad = await actividadService.findOne(id);
      
      res.json({
        message: 'Actividad obtenida exitosamente',
        data: actividad
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear nueva actividad
  async createActividad(req, res, next) {
    try {
      const actividadData = req.body;
      
      // Verificar que el usuario tenga permisos sobre el reporte
      if (req.user.rol !== 'ADMINISTRADOR') {
        const { ReporteService } = require('../services');
        const reporteService = new ReporteService();
        const reporte = await reporteService.findOne(actividadData.id_reporte);
        
        if (reporte.id_docente !== req.user.id) {
          throw boom.forbidden('No tienes permisos para agregar actividades a este reporte');
        }
      }
      
      const newActividad = await actividadService.create(actividadData);
      
      res.status(201).json({
        message: 'Actividad creada exitosamente',
        data: newActividad
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar actividad
  async updateActividad(req, res, next) {
    try {
      const { id } = req.params;
      const actividadData = req.body;
      
      // Verificar permisos
      const actividad = await actividadService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && actividad.reporte.id_docente !== req.user.id) {
        throw boom.forbidden('No tienes permisos para actualizar esta actividad');
      }
      
      const updatedActividad = await actividadService.update(id, actividadData);
      
      res.json({
        message: 'Actividad actualizada exitosamente',
        data: updatedActividad
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar actividad
  async deleteActividad(req, res, next) {
    try {
      const { id } = req.params;
      
      // Verificar permisos
      const actividad = await actividadService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && actividad.reporte.id_docente !== req.user.id) {
        throw boom.forbidden('No tienes permisos para eliminar esta actividad');
      }
      
      await actividadService.delete(id);
      
      res.json({
        message: 'Actividad eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener actividades por reporte
  async getActividadesByReporte(req, res, next) {
    try {
      const { reporteId } = req.params;
      const { categoria, estado_realizado } = req.query;
      
      // Verificar permisos sobre el reporte
      if (req.user.rol !== 'ADMINISTRADOR') {
        const { ReporteService } = require('../services');
        const reporteService = new ReporteService();
        const reporte = await reporteService.findOne(reporteId);
        
        if (reporte.id_docente !== req.user.id) {
          throw boom.forbidden('No tienes permisos para ver las actividades de este reporte');
        }
      }
      
      const filters = {};
      if (categoria) filters.categoria = categoria;
      if (estado_realizado) filters.estado_realizado = estado_realizado;
      
      const actividades = await actividadService.findByReporte(reporteId, filters);
      
      res.json({
        message: 'Actividades obtenidas exitosamente',
        data: actividades
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener actividades por categoría
  async getActividadesByCategory(req, res, next) {
    try {
      const { categoria } = req.params;
      const { estado_realizado, id_reporte } = req.query;
      
      const filters = { categoria };
      if (estado_realizado) filters.estado_realizado = estado_realizado;
      if (id_reporte) filters.id_reporte = parseInt(id_reporte);
      
      const actividades = await actividadService.findByCategory(categoria, filters);
      
      res.json({
        message: 'Actividades obtenidas exitosamente',
        data: actividades
      });
    } catch (error) {
      next(error);
    }
  }

  // Agregar actividad desde catálogo
  async addFromCatalog(req, res, next) {
    try {
      const { id_reporte, id_catalogo } = req.body;
      
      // Verificar permisos sobre el reporte
      if (req.user.rol !== 'ADMINISTRADOR') {
        const { ReporteService } = require('../services');
        const reporteService = new ReporteService();
        const reporte = await reporteService.findOne(id_reporte);
        
        if (reporte.id_docente !== req.user.id) {
          throw boom.forbidden('No tienes permisos para agregar actividades a este reporte');
        }
      }
      
      const newActividad = await actividadService.addFromCatalog(id_reporte, id_catalogo);
      
      res.status(201).json({
        message: 'Actividad agregada desde catálogo exitosamente',
        data: newActividad
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar estado de realización
  async updateRealizationStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { estado_realizado } = req.body;
      
      // Verificar permisos
      const actividad = await actividadService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && actividad.reporte.id_docente !== req.user.id) {
        throw boom.forbidden('No tienes permisos para actualizar el estado de esta actividad');
      }
      
      const updatedActividad = await actividadService.updateRealizationStatus(id, estado_realizado);
      
      res.json({
        message: 'Estado de realización actualizado exitosamente',
        data: updatedActividad
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas por categoría
  async getStatsByCategory(req, res, next) {
    try {
      const { id_reporte, id_periodo } = req.query;
      const filters = {};
      
      if (id_reporte) filters.id_reporte = parseInt(id_reporte);
      if (id_periodo) filters.id_periodo = parseInt(id_periodo);
      
      const stats = await actividadService.getStatsByCategory(filters);
      
      res.json({
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener actividades por estado de realización
  async getActividadesByRealizationStatus(req, res, next) {
    try {
      const { estado } = req.params;
      const { categoria, id_reporte } = req.query;
      
      const filters = { estado_realizado: estado };
      if (categoria) filters.categoria = categoria;
      if (id_reporte) filters.id_reporte = parseInt(id_reporte);
      
      const actividades = await actividadService.findByRealizationStatus(estado, filters);
      
      res.json({
        message: 'Actividades obtenidas exitosamente',
        data: actividades
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActividadController;