import { FechaLimite, PeriodoAcademico, Notificacion } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';
import { Op } from 'sequelize';

// Obtener todas las fechas límite
export const getFechasLimite = async (req, res) => {
  try {
    const { categoria, semestre, activo, id_periodo } = req.query;
    const whereClause = {};
    
    if (categoria) {
      whereClause.categoria = categoria;
    }
    
    if (semestre) {
      whereClause.semestre = semestre;
    }
    
    if (activo !== undefined) {
      whereClause.activo = activo === 'true';
    }
    
    if (id_periodo) {
      whereClause.id_periodo = id_periodo;
    }
    
    const fechasLimite = await FechaLimite.findAll({
      where: whereClause,
      include: [{
        model: PeriodoAcademico,
        as: 'periodo'
      }],
      order: [['fecha_limite', 'ASC']]
    });
    
    res.json(fechasLimite);
  } catch (error) {
    handleError(res, error, 'Error al obtener fechas límite');
  }
};

// Obtener una fecha límite por ID
export const getFechaLimiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const fechaLimite = await FechaLimite.findByPk(id, {
      include: [{
        model: PeriodoAcademico,
        as: 'periodo'
      }]
    });
    
    if (!fechaLimite) {
      return res.status(404).json({ message: 'Fecha límite no encontrada' });
    }
    
    res.json(fechaLimite);
  } catch (error) {
    handleError(res, error, 'Error al obtener fecha límite');
  }
};

// Obtener fechas límite próximas
export const getFechasLimiteProximas = async (req, res) => {
  try {
    const { dias = 7 } = req.query;
    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() + parseInt(dias));
    
    const fechasProximas = await FechaLimite.findAll({
      where: {
        fecha_limite: {
          [Op.between]: [fechaActual, fechaLimite]
        },
        activo: true
      },
      include: [{
        model: PeriodoAcademico,
        as: 'periodo'
      }],
      order: [['fecha_limite', 'ASC']]
    });
    
    res.json(fechasProximas);
  } catch (error) {
    handleError(res, error, 'Error al obtener fechas límite próximas');
  }
};

// Crear una nueva fecha límite
export const createFechaLimite = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      fecha_limite, 
      categoria, 
      id_periodo, 
      semestre, 
      dias_recordatorio, 
      activo 
    } = req.body;
    
    const fechaLimiteObj = await FechaLimite.create({
      nombre,
      descripcion,
      fecha_limite,
      categoria,
      id_periodo,
      semestre,
      dias_recordatorio: dias_recordatorio || 3,
      activo: activo !== undefined ? activo : true
    });
    
    // Incluir el periodo en la respuesta
    const fechaLimiteConPeriodo = await FechaLimite.findByPk(fechaLimiteObj.id_fecha_limite, {
      include: [{
        model: PeriodoAcademico,
        as: 'periodo'
      }]
    });
    
    res.status(201).json(fechaLimiteConPeriodo);
  } catch (error) {
    handleError(res, error, 'Error al crear fecha límite');
  }
};

// Actualizar una fecha límite
export const updateFechaLimite = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      fecha_limite, 
      categoria, 
      id_periodo, 
      semestre, 
      dias_recordatorio, 
      activo 
    } = req.body;
    
    const fechaLimiteObj = await FechaLimite.findByPk(id);
    
    if (!fechaLimiteObj) {
      return res.status(404).json({ message: 'Fecha límite no encontrada' });
    }
    
    await fechaLimiteObj.update({
      nombre,
      descripcion,
      fecha_limite,
      categoria,
      id_periodo,
      semestre,
      dias_recordatorio,
      activo
    });
    
    // Incluir el periodo en la respuesta
    const fechaLimiteActualizada = await FechaLimite.findByPk(id, {
      include: [{
        model: PeriodoAcademico,
        as: 'periodo'
      }]
    });
    
    res.json(fechaLimiteActualizada);
  } catch (error) {
    handleError(res, error, 'Error al actualizar fecha límite');
  }
};

// Eliminar una fecha límite
export const deleteFechaLimite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const fechaLimite = await FechaLimite.findByPk(id);
    
    if (!fechaLimite) {
      return res.status(404).json({ message: 'Fecha límite no encontrada' });
    }
    
    await fechaLimite.destroy();
    
    res.json({ message: 'Fecha límite eliminada correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar fecha límite');
  }
};

// Activar/Desactivar una fecha límite
export const toggleFechaLimite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const fechaLimite = await FechaLimite.findByPk(id);
    
    if (!fechaLimite) {
      return res.status(404).json({ message: 'Fecha límite no encontrada' });
    }
    
    await fechaLimite.update({ activo: !fechaLimite.activo });
    
    res.json({
      message: `Fecha límite ${fechaLimite.activo ? 'activada' : 'desactivada'} correctamente`,
      fechaLimite
    });
  } catch (error) {
    handleError(res, error, 'Error al cambiar estado de la fecha límite');
  }
};