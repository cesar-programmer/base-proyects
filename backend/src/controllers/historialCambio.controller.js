import { HistorialCambio, Reporte, User } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';
import { Op } from 'sequelize';

// Obtener todo el historial de cambios
export const getHistorialCambios = async (req, res) => {
  try {
    const { id_reporte, id_usuario_modificador, fecha_desde, fecha_hasta } = req.query;
    const whereClause = {};
    
    if (id_reporte) {
      whereClause.id_reporte = id_reporte;
    }
    
    if (id_usuario_modificador) {
      whereClause.id_usuario_modificador = id_usuario_modificador;
    }
    
    if (fecha_desde || fecha_hasta) {
      whereClause.fecha_cambio = {};
      if (fecha_desde) {
        whereClause.fecha_cambio[Op.gte] = new Date(fecha_desde);
      }
      if (fecha_hasta) {
        whereClause.fecha_cambio[Op.lte] = new Date(fecha_hasta);
      }
    }
    
    const historial = await HistorialCambio.findAll({
      where: whereClause,
      include: [
        {
          model: Reporte,
          as: 'reporte',
          attributes: ['id_reporte', 'titulo', 'estado']
        },
        {
          model: User,
          as: 'usuarioModificador',
          attributes: ['id_usuario', 'nombre', 'email']
        }
      ],
      order: [['fecha_cambio', 'DESC']]
    });
    
    res.json(historial);
  } catch (error) {
    handleError(res, error, 'Error al obtener historial de cambios');
  }
};

// Obtener un registro del historial por ID
export const getHistorialCambioById = async (req, res) => {
  try {
    const { id } = req.params;
    const historial = await HistorialCambio.findByPk(id, {
      include: [
        {
          model: Reporte,
          as: 'reporte',
          attributes: ['id_reporte', 'titulo', 'estado']
        },
        {
          model: User,
          as: 'usuarioModificador',
          attributes: ['id_usuario', 'nombre', 'email']
        }
      ]
    });
    
    if (!historial) {
      return res.status(404).json({ message: 'Registro de historial no encontrado' });
    }
    
    res.json(historial);
  } catch (error) {
    handleError(res, error, 'Error al obtener registro del historial');
  }
};

// Obtener historial de cambios por reporte
export const getHistorialByReporte = async (req, res) => {
  try {
    const { id_reporte } = req.params;
    const { limit = 50 } = req.query;
    
    const historial = await HistorialCambio.findAll({
      where: { id_reporte },
      include: [
        {
          model: User,
          as: 'usuarioModificador',
          attributes: ['id_usuario', 'nombre', 'email']
        }
      ],
      order: [['fecha_cambio', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json(historial);
  } catch (error) {
    handleError(res, error, 'Error al obtener historial del reporte');
  }
};

// Obtener historial de cambios por usuario
export const getHistorialByUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { limit = 50, fecha_desde, fecha_hasta } = req.query;
    
    const whereClause = { id_usuario_modificador: id_usuario };
    
    if (fecha_desde || fecha_hasta) {
      whereClause.fecha_cambio = {};
      if (fecha_desde) {
        whereClause.fecha_cambio[Op.gte] = new Date(fecha_desde);
      }
      if (fecha_hasta) {
        whereClause.fecha_cambio[Op.lte] = new Date(fecha_hasta);
      }
    }
    
    const historial = await HistorialCambio.findAll({
      where: whereClause,
      include: [
        {
          model: Reporte,
          as: 'reporte',
          attributes: ['id_reporte', 'titulo', 'estado']
        }
      ],
      order: [['fecha_cambio', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json(historial);
  } catch (error) {
    handleError(res, error, 'Error al obtener historial del usuario');
  }
};

// Crear un nuevo registro en el historial
export const createHistorialCambio = async (req, res) => {
  try {
    const { id_reporte, id_usuario_modificador, descripcion_cambio } = req.body;
    
    // Verificar que el reporte existe
    const reporte = await Reporte.findByPk(id_reporte);
    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }
    
    // Verificar que el usuario existe
    const usuario = await User.findByPk(id_usuario_modificador);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const historial = await HistorialCambio.create({
      id_reporte,
      id_usuario_modificador,
      descripcion_cambio
    });
    
    // Incluir relaciones en la respuesta
    const historialCompleto = await HistorialCambio.findByPk(historial.id_historial, {
      include: [
        {
          model: Reporte,
          as: 'reporte',
          attributes: ['id_reporte', 'titulo', 'estado']
        },
        {
          model: User,
          as: 'usuarioModificador',
          attributes: ['id_usuario', 'nombre', 'email']
        }
      ]
    });
    
    res.status(201).json(historialCompleto);
  } catch (error) {
    handleError(res, error, 'Error al crear registro en el historial');
  }
};

// Eliminar un registro del historial
export const deleteHistorialCambio = async (req, res) => {
  try {
    const { id } = req.params;
    
    const historial = await HistorialCambio.findByPk(id);
    
    if (!historial) {
      return res.status(404).json({ message: 'Registro de historial no encontrado' });
    }
    
    await historial.destroy();
    
    res.json({ message: 'Registro del historial eliminado correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar registro del historial');
  }
};

// Eliminar historial antiguo
export const deleteHistorialAntiguo = async (req, res) => {
  try {
    const { dias = 365 } = req.query; // Por defecto, eliminar registros de más de 1 año
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - parseInt(dias));
    
    const deletedCount = await HistorialCambio.destroy({
      where: {
        fecha_cambio: {
          [Op.lt]: fechaLimite
        }
      }
    });
    
    res.json({ 
      message: `${deletedCount} registros de historial antiguos eliminados`,
      registros_eliminados: deletedCount
    });
  } catch (error) {
    handleError(res, error, 'Error al eliminar historial antiguo');
  }
};

// Obtener estadísticas del historial
export const getEstadisticasHistorial = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;
    const whereClause = {};
    
    if (fecha_desde || fecha_hasta) {
      whereClause.fecha_cambio = {};
      if (fecha_desde) {
        whereClause.fecha_cambio[Op.gte] = new Date(fecha_desde);
      }
      if (fecha_hasta) {
        whereClause.fecha_cambio[Op.lte] = new Date(fecha_hasta);
      }
    }
    
    // Estadísticas por usuario
    const estadisticasPorUsuario = await HistorialCambio.findAll({
      where: whereClause,
      attributes: [
        'id_usuario_modificador',
        [HistorialCambio.sequelize.fn('COUNT', '*'), 'total_cambios']
      ],
      include: [
        {
          model: User,
          as: 'usuarioModificador',
          attributes: ['nombre', 'email']
        }
      ],
      group: ['id_usuario_modificador', 'usuarioModificador.id_usuario'],
      order: [[HistorialCambio.sequelize.fn('COUNT', '*'), 'DESC']]
    });
    
    // Estadísticas por fecha (últimos 30 días)
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30);
    
    const estadisticasPorFecha = await HistorialCambio.findAll({
      where: {
        fecha_cambio: {
          [Op.gte]: fechaInicio
        }
      },
      attributes: [
        [HistorialCambio.sequelize.fn('DATE', HistorialCambio.sequelize.col('fecha_cambio')), 'fecha'],
        [HistorialCambio.sequelize.fn('COUNT', '*'), 'total_cambios']
      ],
      group: [HistorialCambio.sequelize.fn('DATE', HistorialCambio.sequelize.col('fecha_cambio'))],
      order: [[HistorialCambio.sequelize.fn('DATE', HistorialCambio.sequelize.col('fecha_cambio')), 'DESC']]
    });
    
    res.json({
      estadisticas_por_usuario: estadisticasPorUsuario,
      estadisticas_por_fecha: estadisticasPorFecha
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener estadísticas del historial');
  }
};