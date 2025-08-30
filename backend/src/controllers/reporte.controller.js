import boom from '@hapi/boom';
import { ReporteService } from '../services/index.js';

const reporteService = new ReporteService();

class ReporteController {
  // Obtener todos los reportes
  async getReportes(req, res, next) {
    try {
      const { page = 1, limit = 10, estado, tipo, id_periodo, id_docente } = req.query;
      const filters = {};
      
      if (estado) filters.estado = estado;
      if (tipo) filters.tipo = tipo;
      if (id_periodo) filters.id_periodo = parseInt(id_periodo);
      if (id_docente) filters.id_docente = parseInt(id_docente);

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
      
      // Si no es admin, asignar el ID del usuario autenticado como docente
      if (req.user.rol !== 'ADMINISTRADOR') {
        reporteData.id_docente = req.user.id;
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
      
      // Verificar permisos: solo el docente propietario o admin pueden actualizar
      const reporte = await reporteService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && reporte.id_docente !== req.user.id) {
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
      if (req.user.rol !== 'ADMINISTRADOR' && reporte.id_docente !== req.user.id) {
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

  // Obtener reportes por docente
  async getReportesByDocente(req, res, next) {
    try {
      const { docenteId } = req.params;
      const { estado, tipo, id_periodo } = req.query;
      
      // Verificar permisos: solo el docente propietario o admin pueden ver
      if (req.user.rol !== 'ADMINISTRADOR' && parseInt(docenteId) !== req.user.id) {
        throw boom.forbidden('No tienes permisos para ver estos reportes');
      }
      
      const filters = { id_docente: parseInt(docenteId) };
      if (estado) filters.estado = estado;
      if (tipo) filters.tipo = tipo;
      if (id_periodo) filters.id_periodo = parseInt(id_periodo);
      
      const reportes = await reporteService.findByDocente(docenteId, filters);
      
      res.json({
        message: 'Reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reportes por período
  async getReportesByPeriod(req, res, next) {
    try {
      const { periodId } = req.params;
      const { estado, tipo } = req.query;
      
      const filters = {};
      if (estado) filters.estado = estado;
      if (tipo) filters.tipo = tipo;
      
      const reportes = await reporteService.findByPeriod(periodId, filters);
      
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
      const { estado, observaciones_admin } = req.body;
      
      // Solo administradores pueden cambiar el estado
      if (req.user.rol !== 'ADMINISTRADOR') {
        throw boom.forbidden('No tienes permisos para cambiar el estado del reporte');
      }
      
      const updatedReporte = await reporteService.changeStatus(id, estado, observaciones_admin);
      
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
      const { id_periodo, id_docente } = req.query;
      const filters = {};
      
      if (id_periodo) filters.id_periodo = parseInt(id_periodo);
      if (id_docente) filters.id_docente = parseInt(id_docente);
      
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
      const { estado, tipo, id_periodo } = req.query;
      
      const filters = { id_docente: userId };
      if (estado) filters.estado = estado;
      if (tipo) filters.tipo = tipo;
      if (id_periodo) filters.id_periodo = parseInt(id_periodo);
      
      const reportes = await reporteService.findByDocente(userId, filters);
      
      res.json({
        message: 'Mis reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ReporteController;