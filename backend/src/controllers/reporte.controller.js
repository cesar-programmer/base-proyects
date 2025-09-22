import boom from '@hapi/boom';
import { ReporteService } from '../services/index.js';

const reporteService = new ReporteService();

class ReporteController {
  // Obtener todos los reportes
  async getReportes(req, res, next) {
    try {
      const { page = 1, limit = 10, estado, actividadId, usuarioId } = req.query;
      const filters = {};
      
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      if (usuarioId) filters.usuarioId = parseInt(usuarioId);

      const reportes = await reporteService.find({
        page: parseInt(page),
        limit: parseInt(limit),
        ...filters
      });

      res.json({
        message: 'Reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reporte por ID
  async getReporte(req, res, next) {
    try {
      const { id } = req.params;
      const reporte = await reporteService.findOne(id);
      
      res.json({
        message: 'Reporte obtenido exitosamente',
        data: reporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear nuevo reporte
  async createReporte(req, res, next) {
    try {
      const reporteData = req.body;
      
      // Si no es admin, asignar el ID del usuario autenticado
      if (req.user.rol !== 'ADMINISTRADOR') {
        reporteData.usuarioId = req.user.id;
      }
      
      const newReporte = await reporteService.create(reporteData);
      
      res.status(201).json({
        message: 'Reporte creado exitosamente',
        data: newReporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar reporte
  async updateReporte(req, res, next) {
    try {
      const { id } = req.params;
      const reporteData = req.body;
      
      // Verificar permisos: solo el usuario propietario o admin pueden actualizar
      const reporte = await reporteService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && reporte.usuarioId !== req.user.id) {
        throw boom.forbidden('No tienes permisos para actualizar este reporte');
      }
      
      const updatedReporte = await reporteService.update(id, reporteData);
      
      res.json({
        message: 'Reporte actualizado exitosamente',
        data: updatedReporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar reporte
  async deleteReporte(req, res, next) {
    try {
      const { id } = req.params;
      
      // Verificar permisos
      const reporte = await reporteService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && reporte.usuarioId !== req.user.id) {
        throw boom.forbidden('No tienes permisos para eliminar este reporte');
      }
      
      await reporteService.delete(id);
      
      res.json({
        message: 'Reporte eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reportes por usuario
  async getReportesByDocente(req, res, next) {
    try {
      const { docenteId } = req.params;
      const { estado, actividadId } = req.query;
      
      // Verificar permisos: solo el usuario propietario o admin pueden ver
      if (req.user.rol !== 'ADMINISTRADOR' && parseInt(docenteId) !== req.user.id) {
        throw boom.forbidden('No tienes permisos para ver estos reportes');
      }
      
      const filters = { usuarioId: parseInt(docenteId) };
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      
      const reportes = await reporteService.findByDocente(docenteId, filters);
      
      res.json({
        message: 'Reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reportes por actividad
  async getReportesByPeriod(req, res, next) {
    try {
      const { periodId } = req.params;
      const { estado } = req.query;
      
      const filters = {};
      if (estado) filters.estado = estado;
      
      const reportes = await reporteService.findByActividad(periodId, filters);
      
      res.json({
        message: 'Reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Cambiar estado del reporte
  async changeReporteStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { estado, comentariosRevision } = req.body;
      
      // Solo administradores pueden cambiar el estado
      if (req.user.rol !== 'ADMINISTRADOR') {
        throw boom.forbidden('No tienes permisos para cambiar el estado del reporte');
      }
      
      const updatedReporte = await reporteService.changeStatus(id, estado, comentariosRevision);
      
      res.json({
        message: 'Estado del reporte actualizado exitosamente',
        data: updatedReporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de reportes
  async getReporteStats(req, res, next) {
    try {
      const { actividadId, usuarioId } = req.query;
      const filters = {};
      
      if (actividadId) filters.actividadId = parseInt(actividadId);
      if (usuarioId) filters.usuarioId = parseInt(usuarioId);
      
      const stats = await reporteService.getStats(filters);
      
      res.json({
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reportes pendientes de revisión
  async getReportesPendingReview(req, res, next) {
    try {
      // Solo administradores pueden ver reportes pendientes
      if (req.user.rol !== 'ADMINISTRADOR') {
        throw boom.forbidden('No tienes permisos para ver reportes pendientes');
      }
      
      const reportes = await reporteService.findPendingReview();
      
      res.json({
        message: 'Reportes pendientes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener mis reportes (usuario autenticado)
  async getMyReportes(req, res, next) {
    try {
      const userId = req.user.id;
      const { estado, actividadId } = req.query;
      
      const filters = { usuarioId: userId };
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      
      const reportes = await reporteService.findByDocente(userId, filters);
      
      res.json({
        message: 'Mis reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener historial de reportes de un docente
  async getReportHistory(req, res, next) {
    try {
      const { docenteId } = req.query;
      
      if (!docenteId) {
        throw boom.badRequest('El parámetro docenteId es requerido');
      }
      
      const { estado, tipo, fechaInicio, fechaFin } = req.query;
      
      const filters = {};
      if (estado) filters.estado = estado;
      if (tipo) filters.tipo = tipo;
      if (fechaInicio) filters.fechaInicio = fechaInicio;
      if (fechaFin) filters.fechaFin = fechaFin;
      
      const reportes = await reporteService.getReportHistory(parseInt(docenteId), filters);
      
      res.json({
        message: 'Historial de reportes obtenido exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ReporteController;