import boom from '@hapi/boom';
import { models } from '../db/models/index.js';
import NotificacionService from '../services/notificacion.service.js';

const notificacionService = new NotificacionService();

class RecordatorioController {
  // Obtener configuración de recordatorios
  async getConfiguracion(req, res, next) {
    try {
      // Buscar configuración existente
      let configuracion = await models.Configuracion.findOne({
        where: { clave: 'recordatorios.configuracion' }
      });

      if (!configuracion) {
        // Crear configuración por defecto
        const configDefault = {
          activo: false,
          frecuencia: 'semanal',
          dia_semana: 'lunes',
          hora: '09:00',
          destinatarios: 'todos',
          mensaje: 'Recordatorio: Tiene actividades pendientes por completar. Por favor, revise su panel de control para más detalles.'
        };

        configuracion = await models.Configuracion.create({
          clave: 'recordatorios.configuracion',
          valor: JSON.stringify(configDefault),
          descripcion: 'Configuración de recordatorios automáticos'
        });
      }

      const config = JSON.parse(configuracion.valor);
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      next(boom.internal('Error al obtener configuración de recordatorios'));
    }
  }

  // Actualizar configuración de recordatorios
  async updateConfiguracion(req, res, next) {
    try {
      const configuracionData = req.body;

      // Buscar configuración existente
      let configuracion = await models.Configuracion.findOne({
        where: { clave: 'recordatorios.configuracion' }
      });

      if (configuracion) {
        // Actualizar configuración existente
        await configuracion.update({
          valor: JSON.stringify(configuracionData)
        });
      } else {
        // Crear nueva configuración
        configuracion = await models.Configuracion.create({
          clave: 'recordatorios.configuracion',
          valor: JSON.stringify(configuracionData),
          descripcion: 'Configuración de recordatorios automáticos'
        });
      }

      res.json({
        success: true,
        message: 'Configuración actualizada correctamente',
        data: JSON.parse(configuracion.valor)
      });
    } catch (error) {
      next(boom.internal('Error al actualizar configuración de recordatorios'));
    }
  }



  // Enviar recordatorio manual
  async enviarManual(req, res, next) {
    try {
      const { mensaje, destinatarios } = req.body;

      let usuarios = [];

      if (destinatarios === 'todos') {
        // Obtener todos los usuarios activos
        usuarios = await models.User.findAll({
          where: { activo: true },
          attributes: ['id', 'nombre', 'apellido', 'email']
        });
      } else if (destinatarios === 'pendientes') {
        // Obtener usuarios con reportes pendientes
        usuarios = await models.User.findAll({
          where: { 
            activo: true,
            // Aquí podrías agregar lógica para usuarios con pendientes
          },
          attributes: ['id', 'nombre', 'apellido', 'email']
        });
      }

      const notificacionesCreadas = [];

      // Crear notificación para cada usuario
      for (const usuario of usuarios) {
        const notificacionData = {
          id_usuario_destino: usuario.id,
          mensaje: mensaje,
          tipo: 'RECORDATORIO'
        };

        const notificacion = await notificacionService.create(notificacionData);
        notificacionesCreadas.push(notificacion);
      }

      res.json({
        success: true,
        message: `Recordatorio enviado a ${notificacionesCreadas.length} usuarios`,
        data: {
          enviados: notificacionesCreadas.length,
          destinatarios: usuarios.map(u => ({
            id: u.id,
            nombre: `${u.nombre} ${u.apellido}`,
            email: u.email
          }))
        }
      });
    } catch (error) {
      next(boom.internal('Error al enviar recordatorio manual'));
    }
  }

  // Activar/desactivar recordatorios
  async toggle(req, res, next) {
    try {
      const { activo } = req.body;

      // Obtener configuración actual
      let configuracion = await models.Configuracion.findOne({
        where: { clave: 'recordatorios.configuracion' }
      });

      if (!configuracion) {
        return next(boom.notFound('Configuración de recordatorios no encontrada'));
      }

      const config = JSON.parse(configuracion.valor);
      config.activo = activo;

      await configuracion.update({
        valor: JSON.stringify(config)
      });

      res.json({
        success: true,
        message: `Recordatorios ${activo ? 'activados' : 'desactivados'} correctamente`,
        data: { activo }
      });
    } catch (error) {
      next(boom.internal('Error al cambiar estado de recordatorios'));
    }
  }

  // Obtener destinatarios disponibles
  async getDestinatarios(req, res, next) {
    try {
      const { tipo } = req.query;

      let usuarios = [];
      let count = 0;

      if (tipo === 'todos') {
        // Obtener todos los usuarios activos
        usuarios = await models.User.findAll({
          where: { activo: true },
          attributes: ['id', 'nombre', 'apellido', 'email'],
          include: [
            {
              model: models.Role,
              as: 'rol',
              attributes: ['nombre']
            }
          ],
          order: [['nombre', 'ASC']]
        });
        count = usuarios.length;
      } else if (tipo === 'pendientes') {
        // Obtener usuarios con reportes pendientes
        usuarios = await models.User.findAll({
          where: { 
            activo: true,
            // Aquí podrías agregar lógica específica para usuarios con pendientes
          },
          attributes: ['id', 'nombre', 'apellido', 'email'],
          include: [
            {
              model: models.Role,
              as: 'rol',
              attributes: ['nombre']
            }
          ],
          order: [['nombre', 'ASC']]
        });
        count = usuarios.length;
      }

      res.json({
        success: true,
        data: {
          destinatarios: usuarios.map(u => ({
            id: u.id,
            nombre: `${u.nombre} ${u.apellido}`,
            email: u.email,
            rol: u.rol?.nombre || 'Sin rol'
          })),
          total: count,
          tipo
        }
      });
    } catch (error) {
      next(boom.internal('Error al obtener destinatarios'));
    }
  }

  // Obtener estadísticas de recordatorios
  async getEstadisticas(req, res, next) {
    try {
      const totalEnviados = await models.Notificacion.count({
        where: { tipo: 'RECORDATORIO' }
      });

      const totalLeidos = await models.Notificacion.count({
        where: { 
          tipo: 'RECORDATORIO',
          leido: true 
        }
      });

      const enviadosHoy = await models.Notificacion.count({
        where: {
          tipo: 'RECORDATORIO',
          fecha_creacion: {
            [models.Sequelize.Op.gte]: new Date().setHours(0, 0, 0, 0)
          }
        }
      });

      const enviadosEstaSemana = await models.Notificacion.count({
        where: {
          tipo: 'RECORDATORIO',
          fecha_creacion: {
            [models.Sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      });

      const tasaApertura = totalEnviados > 0 ? ((totalLeidos / totalEnviados) * 100).toFixed(1) : 0;

      res.json({
        success: true,
        data: {
          totalEnviados,
          totalLeidos,
          enviadosHoy,
          enviadosEstaSemana,
          tasaApertura: parseFloat(tasaApertura)
        }
      });
    } catch (error) {
      next(boom.internal('Error al obtener estadísticas de recordatorios'));
    }
  }
}

export default RecordatorioController;