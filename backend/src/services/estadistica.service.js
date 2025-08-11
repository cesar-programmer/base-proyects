const boom = require('@hapi/boom');
const { models } = require('../db/models');

class EstadisticaService {
  // Obtener estadísticas generales del sistema
  async getGeneralStats() {
    try {
      const [
        totalUsuarios,
        totalReportes,
        totalActividades,
        totalFechasLimite,
        totalNotificaciones
      ] = await Promise.all([
        models.User.count(),
        models.Reporte.count(),
        models.Actividad.count(),
        models.FechaLimite.count(),
        models.Notificacion.count()
      ]);

      return {
        usuarios: totalUsuarios,
        reportes: totalReportes,
        actividades: totalActividades,
        fechasLimite: totalFechasLimite,
        notificaciones: totalNotificaciones
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas generales');
    }
  }

  // Obtener estadísticas de usuarios
  async getUserStats() {
    try {
      const totalUsuarios = await models.User.count();
      const usuariosActivos = await models.User.count({ where: { activo: true } });
      const usuariosPorRol = await models.User.findAll({
        attributes: [
          'id_rol',
          [models.sequelize.fn('COUNT', models.sequelize.col('id_rol')), 'count']
        ],
        include: [
          {
            model: models.Role,
            as: 'rol',
            attributes: ['nombre']
          }
        ],
        group: ['id_rol']
      });

      return {
        total: totalUsuarios,
        activos: usuariosActivos,
        inactivos: totalUsuarios - usuariosActivos,
        porRol: usuariosPorRol
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas de usuarios');
    }
  }

  // Obtener estadísticas de reportes
  async getReportStats() {
    try {
      const totalReportes = await models.Reporte.count();
      const reportesPorEstado = await models.Reporte.findAll({
        attributes: [
          'estado',
          [models.sequelize.fn('COUNT', models.sequelize.col('estado')), 'count']
        ],
        group: ['estado']
      });

      const reportesPorTipo = await models.Reporte.findAll({
        attributes: [
          'tipo',
          [models.sequelize.fn('COUNT', models.sequelize.col('tipo')), 'count']
        ],
        group: ['tipo']
      });

      const reportesPorPeriodo = await models.Reporte.findAll({
        attributes: [
          'id_periodo',
          [models.sequelize.fn('COUNT', models.sequelize.col('id_periodo')), 'count']
        ],
        include: [
          {
            model: models.PeriodoAcademico,
            as: 'periodo',
            attributes: ['nombre']
          }
        ],
        group: ['id_periodo']
      });

      return {
        total: totalReportes,
        porEstado: reportesPorEstado,
        porTipo: reportesPorTipo,
        porPeriodo: reportesPorPeriodo
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas de reportes');
    }
  }

  // Obtener estadísticas de actividades
  async getActivityStats() {
    try {
      const totalActividades = await models.Actividad.count();
      const actividadesPorCategoria = await models.Actividad.findAll({
        attributes: [
          'categoria',
          [models.sequelize.fn('COUNT', models.sequelize.col('categoria')), 'count'],
          [models.sequelize.fn('SUM', models.sequelize.col('horas_estimadas')), 'total_horas']
        ],
        group: ['categoria']
      });

      const actividadesPersonalizadas = await models.Actividad.count({
        where: { es_personalizada: true }
      });

      const actividadesDelCatalogo = await models.Actividad.count({
        where: { es_personalizada: false }
      });

      return {
        total: totalActividades,
        personalizadas: actividadesPersonalizadas,
        delCatalogo: actividadesDelCatalogo,
        porCategoria: actividadesPorCategoria
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas de actividades');
    }
  }

  // Obtener estadísticas de fechas límite
  async getDeadlineStats() {
    try {
      const totalFechasLimite = await models.FechaLimite.count();
      const fechasLimiteActivas = await models.FechaLimite.count({
        where: { activo: true }
      });

      const fechasLimitePorCategoria = await models.FechaLimite.findAll({
        attributes: [
          'categoria',
          [models.sequelize.fn('COUNT', models.sequelize.col('categoria')), 'count']
        ],
        where: { activo: true },
        group: ['categoria']
      });

      const fechasLimiteVencidas = await models.FechaLimite.count({
        where: {
          activo: true,
          fecha_limite: {
            [models.sequelize.Op.lt]: new Date()
          }
        }
      });

      const fechasLimiteProximas = await models.FechaLimite.count({
        where: {
          activo: true,
          fecha_limite: {
            [models.sequelize.Op.between]: [
              new Date(),
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
            ]
          }
        }
      });

      return {
        total: totalFechasLimite,
        activas: fechasLimiteActivas,
        vencidas: fechasLimiteVencidas,
        proximas: fechasLimiteProximas,
        porCategoria: fechasLimitePorCategoria
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas de fechas límite');
    }
  }

  // Obtener estadísticas de notificaciones
  async getNotificationStats() {
    try {
      const totalNotificaciones = await models.Notificacion.count();
      const notificacionesLeidas = await models.Notificacion.count({
        where: { leido: true }
      });

      const notificacionesPorTipo = await models.Notificacion.findAll({
        attributes: [
          'tipo',
          [models.sequelize.fn('COUNT', models.sequelize.col('tipo')), 'count']
        ],
        group: ['tipo']
      });

      const notificacionesPorUsuario = await models.Notificacion.findAll({
        attributes: [
          'id_usuario_destino',
          [models.sequelize.fn('COUNT', models.sequelize.col('id_usuario_destino')), 'count']
        ],
        include: [
          {
            model: models.User,
            as: 'usuario_destino',
            attributes: ['nombre_completo']
          }
        ],
        group: ['id_usuario_destino'],
        order: [[models.sequelize.literal('count'), 'DESC']],
        limit: 10
      });

      return {
        total: totalNotificaciones,
        leidas: notificacionesLeidas,
        noLeidas: totalNotificaciones - notificacionesLeidas,
        porTipo: notificacionesPorTipo,
        porUsuario: notificacionesPorUsuario
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas de notificaciones');
    }
  }

  // Obtener estadísticas de un periodo específico
  async getPeriodStats(periodId) {
    try {
      const reportesEnPeriodo = await models.Reporte.count({
        where: { id_periodo: periodId }
      });

      const actividadesEnPeriodo = await models.Actividad.count({
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            where: { id_periodo: periodId }
          }
        ]
      });

      const fechasLimiteEnPeriodo = await models.FechaLimite.count({
        where: { id_periodo: periodId }
      });

      const reportesPorEstado = await models.Reporte.findAll({
        attributes: [
          'estado',
          [models.sequelize.fn('COUNT', models.sequelize.col('estado')), 'count']
        ],
        where: { id_periodo: periodId },
        group: ['estado']
      });

      return {
        reportes: reportesEnPeriodo,
        actividades: actividadesEnPeriodo,
        fechasLimite: fechasLimiteEnPeriodo,
        reportesPorEstado
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas del periodo');
    }
  }

  // Obtener estadísticas de un usuario específico
  async getUserSpecificStats(userId) {
    try {
      const reportesDelUsuario = await models.Reporte.count({
        where: { id_docente: userId }
      });

      const actividadesDelUsuario = await models.Actividad.count({
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            where: { id_docente: userId }
          }
        ]
      });

      const notificacionesDelUsuario = await models.Notificacion.count({
        where: { id_usuario_destino: userId }
      });

      const notificacionesNoLeidas = await models.Notificacion.count({
        where: { 
          id_usuario_destino: userId,
          leido: false
        }
      });

      const reportesPorEstado = await models.Reporte.findAll({
        attributes: [
          'estado',
          [models.sequelize.fn('COUNT', models.sequelize.col('estado')), 'count']
        ],
        where: { id_docente: userId },
        group: ['estado']
      });

      return {
        reportes: reportesDelUsuario,
        actividades: actividadesDelUsuario,
        notificaciones: notificacionesDelUsuario,
        notificacionesNoLeidas,
        reportesPorEstado
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas del usuario');
    }
  }

  // Obtener dashboard completo de estadísticas
  async getDashboardStats() {
    try {
      const [
        generalStats,
        userStats,
        reportStats,
        activityStats,
        deadlineStats,
        notificationStats
      ] = await Promise.all([
        this.getGeneralStats(),
        this.getUserStats(),
        this.getReportStats(),
        this.getActivityStats(),
        this.getDeadlineStats(),
        this.getNotificationStats()
      ]);

      return {
        general: generalStats,
        usuarios: userStats,
        reportes: reportStats,
        actividades: activityStats,
        fechasLimite: deadlineStats,
        notificaciones: notificationStats
      };
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas del dashboard');
    }
  }
}

module.exports = EstadisticaService;
