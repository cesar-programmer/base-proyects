import boom from '@hapi/boom';
import { models } from '../db/models/index.js';

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

      // Simplificar la consulta de usuarios por rol
      const usuarios = await models.User.findAll({
        attributes: ['rolId'],
        include: [
          {
            model: models.Role,
            as: 'rol',
            attributes: ['nombre']
          }
        ]
      });

      // Contar manualmente por rol
      const roleCount = {};
      usuarios.forEach(user => {
        const roleName = user.rol ? user.rol.nombre : 'Sin rol';
        roleCount[roleName] = (roleCount[roleName] || 0) + 1;
      });

      const usuariosPorRol = Object.entries(roleCount).map(([nombre, count]) => ({
        rol: { nombre },
        count
      }));

      return {
        total: totalUsuarios,
        activos: usuariosActivos,
        inactivos: totalUsuarios - usuariosActivos,
        porRol: usuariosPorRol
      };
    } catch (error) {
      console.error('Error en getUserStats:', error);
      throw boom.internal('Error al obtener estadísticas de usuarios');
    }
  }

  // Obtener estadísticas de reportes
  async getReportStats() {
    try {
      const totalReportes = await models.Reporte.count();
      
      // Simplificar las consultas para evitar problemas con GROUP BY
      const reportes = await models.Reporte.findAll({
        attributes: ['estado']
      });

      // Contar manualmente por estado
      const estadoCount = {};
      reportes.forEach(reporte => {
        const estado = reporte.estado || 'Sin estado';
        estadoCount[estado] = (estadoCount[estado] || 0) + 1;
      });

      const reportesPorEstado = Object.entries(estadoCount).map(([estado, count]) => ({
        estado,
        count
      }));

      return {
        total: totalReportes,
        porEstado: reportesPorEstado
      };
    } catch (error) {
      console.error('Error en getReportStats:', error);
      throw boom.internal('Error al obtener estadísticas de reportes');
    }
  }

  // Obtener estadísticas de actividades
  async getActivityStats() {
    try {
      const totalActividades = await models.Actividad.count();
      
      // ⭐ Estadísticas por estado_realizado (lo que realmente necesitamos)
      const actividadesPorEstado = await models.Actividad.findAll({
        attributes: [
          'estado_realizado',
          [models.sequelize.fn('COUNT', models.sequelize.col('estado_realizado')), 'count'],
          [models.sequelize.fn('SUM', models.sequelize.col('horas_estimadas')), 'total_horas']
        ],
        group: ['estado_realizado']
      });

      // Estadísticas por categoría (mantenemos para compatibilidad)
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

      // Conteos específicos por estado
      const aprobadas = await models.Actividad.count({
        where: { estado_realizado: 'aprobada' }
      });

      const pendientes = await models.Actividad.count({
        where: { estado_realizado: 'pendiente' }
      });

      const devueltas = await models.Actividad.count({
        where: { estado_realizado: 'devuelta' }
      });

      return {
        total: totalActividades,
        personalizadas: actividadesPersonalizadas,
        delCatalogo: actividadesDelCatalogo,
        porCategoria: actividadesPorCategoria,
        // ⭐ Nuevos datos por estado
        porEstado: actividadesPorEstado,
        aprobadas,
        pendientes,
        devueltas
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
      // Consultas básicas sin agregaciones complejas
      const totalNotificaciones = await models.Notificacion.count();
      const notificacionesLeidas = await models.Notificacion.count({
        where: { leido: true }
      });

      // Obtener tipos de notificaciones de forma simple
      const notificacionesPorTipo = await models.Notificacion.findAll({
        attributes: ['tipo'],
        group: ['tipo'],
        raw: true
      });

      // Contar manualmente cada tipo
      const tiposCount = {};
      for (const tipo of notificacionesPorTipo) {
        const count = await models.Notificacion.count({
          where: { tipo: tipo.tipo }
        });
        tiposCount[tipo.tipo] = count;
      }

      return {
        total: totalNotificaciones,
        leidas: notificacionesLeidas,
        noLeidas: totalNotificaciones - notificacionesLeidas,
        porTipo: Object.entries(tiposCount).map(([tipo, count]) => ({
          tipo,
          count
        })),
        porUsuario: [] // Simplificado por ahora
      };
    } catch (error) {
      console.error('Error en getNotificationStats:', error);
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
      console.log('Obteniendo estadísticas completas del dashboard...');
      
      // Estadísticas básicas
      const totalUsuarios = await models.User.count();
      console.log('Total usuarios:', totalUsuarios);
      
      const usuariosActivos = await models.User.count({ where: { activo: true } });
      console.log('Usuarios activos:', usuariosActivos);
      
      const totalReportes = await models.Reporte.count();
      console.log('Total reportes:', totalReportes);
      
      const totalActividades = await models.Actividad.count();
      console.log('Total actividades:', totalActividades);
      
      const totalNotificaciones = await models.Notificacion.count();
      console.log('Total notificaciones:', totalNotificaciones);

      // ⭐ Estadísticas detalladas de actividades por estado
      const aprobadas = await models.Actividad.count({
        where: { estado_realizado: 'aprobada' }
      });
      console.log('Actividades aprobadas:', aprobadas);

      const pendientes = await models.Actividad.count({
        where: { estado_realizado: 'pendiente' }
      });
      console.log('Actividades pendientes:', pendientes);

      const devueltas = await models.Actividad.count({
        where: { estado_realizado: 'devuelta' }
      });
      console.log('Actividades devueltas:', devueltas);

      const result = {
        general: {
          totalUsuarios,
          usuariosActivos,
          totalReportes,
          totalActividades,
          totalNotificaciones
        },
        usuarios: {
          total: totalUsuarios,
          activos: usuariosActivos,
          inactivos: totalUsuarios - usuariosActivos
        },
        reportes: {
          total: totalReportes
        },
        actividades: {
          total: totalActividades,
          aprobadas,
          pendientes,
          devueltas
        },
        notificaciones: {
          total: totalNotificaciones
        }
      };

      console.log('Resultado final:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error específico en getDashboardStats:', error);
      throw boom.internal('Error al obtener estadísticas del dashboard');
    }
  }
}

export default EstadisticaService;
