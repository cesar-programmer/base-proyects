import EstadisticaService from '../services/estadistica.service.js';

// Cambio para reiniciar nodemon automáticamente
class EstadisticaController {
  constructor() {
    this.estadisticaService = new EstadisticaService();
  }

  // Obtener estadísticas generales del sistema
  async getGeneralStats(req, res, next) {
    try {
      const stats = await this.estadisticaService.getGeneralStats();
      
      res.json({
        message: 'Estadísticas generales obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de usuarios
  async getUserStats(req, res, next) {
    try {
      const stats = await this.estadisticaService.getUserStats();
      
      res.json({
        message: 'Estadísticas de usuarios obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de reportes
  async getReportStats(req, res, next) {
    try {
      const stats = await this.estadisticaService.getReportStats();
      
      res.json({
        message: 'Estadísticas de reportes obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de actividades
  async getActivityStats(req, res, next) {
    try {
      const stats = await this.estadisticaService.getActivityStats();
      
      res.json({
        message: 'Estadísticas de actividades obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de fechas límite
  async getDeadlineStats(req, res, next) {
    try {
      const stats = await this.estadisticaService.getDeadlineStats();
      
      res.json({
        message: 'Estadísticas de fechas límite obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de notificaciones
  async getNotificationStats(req, res, next) {
    try {
      const stats = await this.estadisticaService.getNotificationStats();
      
      res.json({
        message: 'Estadísticas de notificaciones obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de un periodo específico
  async getPeriodStats(req, res, next) {
    try {
      const { periodId } = req.params;
      const stats = await this.estadisticaService.getPeriodStats(periodId);
      
      res.json({
        message: 'Estadísticas del periodo obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de un usuario específico
  async getUserSpecificStats(req, res, next) {
    try {
      const { userId } = req.params;
      const stats = await this.estadisticaService.getUserSpecificStats(userId);
      
      res.json({
        message: 'Estadísticas del usuario obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // ⭐ ESTE ES EL MÁS IMPORTANTE - Dashboard completo
  async getDashboardStats(req, res, next) {
    try {
      const stats = await this.estadisticaService.getDashboardStats();
      
      res.json({
        message: 'Estadísticas del dashboard obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EstadisticaController;