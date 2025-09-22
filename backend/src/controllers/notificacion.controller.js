import { Notificacion, User, FechaLimite } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';
import { Op } from 'sequelize';

// Obtener todas las notificaciones
export const getNotificaciones = async (req, res) => {
  try {
    const { id_usuario_destino, tipo, leido } = req.query;
    const whereClause = {};
    
    if (id_usuario_destino) {
      whereClause.id_usuario_destino = id_usuario_destino;
    }
    
    if (tipo) {
      whereClause.tipo = tipo;
    }
    
    if (leido !== undefined) {
      whereClause.leido = leido === 'true';
    }
    
    const notificaciones = await Notificacion.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'email']
        },
        {
          model: FechaLimite,
          as: 'fechaLimite',
          required: false
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });
    
    res.json(notificaciones);
  } catch (error) {
    handleError(res, error, 'Error al obtener notificaciones');
  }
};

// Obtener una notificación por ID
export const getNotificacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByPk(id, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'email']
        },
        {
          model: FechaLimite,
          as: 'fechaLimite',
          required: false
        }
      ]
    });
    
    if (!notificacion) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }
    
    res.json(notificacion);
  } catch (error) {
    handleError(res, error, 'Error al obtener notificación');
  }
};

// Obtener notificaciones de un usuario
export const getNotificacionesByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { leido, limit = 50 } = req.query;
    
    const whereClause = { id_usuario_destino: usuarioId };
    
    if (leido !== undefined) {
      whereClause.leido = leido === 'true';
    }
    
    const notificaciones = await Notificacion.findAll({
      where: whereClause,
      include: [
        {
          model: FechaLimite,
          as: 'fechaLimite',
          required: false
        }
      ],
      order: [['fecha_creacion', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json(notificaciones);
  } catch (error) {
    handleError(res, error, 'Error al obtener notificaciones del usuario');
  }
};

// Obtener notificaciones no leídas de un usuario
export const getNotificacionesNoLeidas = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const notificaciones = await Notificacion.findAll({
      where: {
        id_usuario_destino: usuarioId,
        leido: false
      },
      include: [
        {
          model: FechaLimite,
          as: 'fechaLimite',
          required: false
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });
    
    res.json(notificaciones);
  } catch (error) {
    handleError(res, error, 'Error al obtener notificaciones no leídas');
  }
};

// Crear una nueva notificación
export const createNotificacion = async (req, res) => {
  try {
    const { 
      id_usuario_destino, 
      mensaje, 
      tipo, 
      id_fecha_limite 
    } = req.body;
    
    // Verificar que el usuario existe
    const usuario = await User.findByPk(id_usuario_destino);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si se especifica una fecha límite, verificar que existe
    if (id_fecha_limite) {
      const fechaLimite = await FechaLimite.findByPk(id_fecha_limite);
      if (!fechaLimite) {
        return res.status(404).json({ message: 'Fecha límite no encontrada' });
      }
    }
    
    const notificacion = await Notificacion.create({
      id_usuario_destino,
      mensaje,
      tipo,
      id_fecha_limite,
      leido: false
    });
    
    // Incluir relaciones en la respuesta
    const notificacionCompleta = await Notificacion.findByPk(notificacion.id_notificacion, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'email']
        },
        {
          model: FechaLimite,
          as: 'fechaLimite',
          required: false
        }
      ]
    });
    
    res.status(201).json(notificacionCompleta);
  } catch (error) {
    handleError(res, error, 'Error al crear notificación');
  }
};

// Marcar una notificación como leída
export const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notificacion = await Notificacion.findByPk(id);
    
    if (!notificacion) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }
    
    await notificacion.update({ leido: true });
    
    res.json({ message: 'Notificación marcada como leída', notificacion });
  } catch (error) {
    handleError(res, error, 'Error al marcar notificación como leída');
  }
};

// Marcar todas las notificaciones de un usuario como leídas
export const marcarTodasComoLeidas = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const [updatedCount] = await Notificacion.update(
      { leido: true },
      {
        where: {
          id_usuario_destino: usuarioId,
          leido: false
        }
      }
    );
    
    res.json({ 
      message: `${updatedCount} notificaciones marcadas como leídas`,
      notificaciones_actualizadas: updatedCount
    });
  } catch (error) {
    handleError(res, error, 'Error al marcar todas las notificaciones como leídas');
  }
};

// Eliminar una notificación
export const deleteNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notificacion = await Notificacion.findByPk(id);
    
    if (!notificacion) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }
    
    await notificacion.destroy();
    
    res.json({ message: 'Notificación eliminada correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar notificación');
  }
};

// Eliminar notificaciones antiguas
export const deleteNotificacionesAntiguas = async (req, res) => {
  try {
    const { dias = 30 } = req.query;
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - parseInt(dias));
    
    const deletedCount = await Notificacion.destroy({
      where: {
        fecha_creacion: {
          [Op.lt]: fechaLimite
        },
        leido: true
      }
    });
    
    res.json({ 
      message: `${deletedCount} notificaciones antiguas eliminadas`,
      notificaciones_eliminadas: deletedCount
    });
  } catch (error) {
    handleError(res, error, 'Error al eliminar notificaciones antiguas');
  }
};

// Obtener estadísticas de notificaciones
export const getEstadisticasNotificaciones = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const estadisticas = await Notificacion.findAll({
      where: { id_usuario_destino: usuarioId },
      attributes: [
        'tipo',
        'leido',
        [Notificacion.sequelize.fn('COUNT', '*'), 'cantidad']
      ],
      group: ['tipo', 'leido'],
      raw: true
    });
    
    res.json(estadisticas);
  } catch (error) {
    handleError(res, error, 'Error al obtener estadísticas de notificaciones');
  }
};