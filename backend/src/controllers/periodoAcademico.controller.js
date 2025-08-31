import { PeriodoAcademico } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';

// Obtener todos los periodos académicos
export const getPeriodosAcademicos = async (req, res) => {
  try {
    const periodos = await PeriodoAcademico.findAll({
      order: [['fechaInicio', 'DESC']]
    });
    res.json(periodos);
  } catch (error) {
    handleError(res, error, 'Error al obtener periodos académicos');
  }
};

// Obtener un periodo académico por ID
export const getPeriodoAcademicoById = async (req, res) => {
  try {
    const { id } = req.params;
    const periodo = await PeriodoAcademico.findByPk(id);
    
    if (!periodo) {
      return res.status(404).json({ message: 'Periodo académico no encontrado' });
    }
    
    res.json(periodo);
  } catch (error) {
    handleError(res, error, 'Error al obtener periodo académico');
  }
};

// Obtener el periodo académico activo
export const getPeriodoActivo = async (req, res) => {
  try {
    const periodo = await PeriodoAcademico.findOne({
      where: { activo: true }
    });
    
    if (!periodo) {
      return res.status(404).json({ message: 'No hay periodo académico activo' });
    }
    
    res.json(periodo);
  } catch (error) {
    handleError(res, error, 'Error al obtener periodo activo');
  }
};

// Crear un nuevo periodo académico
export const createPeriodoAcademico = async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin, activo, descripcion } = req.body;
    
    // Si se marca como activo, desactivar otros periodos
    if (activo) {
      await PeriodoAcademico.update(
        { activo: false },
        { where: { activo: true } }
      );
    }
    
    const periodo = await PeriodoAcademico.create({
      nombre,
      fechaInicio,
      fechaFin,
      descripcion,
      activo: activo || false
    });
    
    res.status(201).json(periodo);
  } catch (error) {
    handleError(res, error, 'Error al crear periodo académico');
  }
};

// Actualizar un periodo académico
export const updatePeriodoAcademico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fechaInicio, fechaFin, activo, descripcion } = req.body;
    
    const periodo = await PeriodoAcademico.findByPk(id);
    
    if (!periodo) {
      return res.status(404).json({ message: 'Periodo académico no encontrado' });
    }
    
    // Si se marca como activo, desactivar otros periodos
    if (activo && !periodo.activo) {
      await PeriodoAcademico.update(
        { activo: false },
        { where: { activo: true } }
      );
    }
    
    await periodo.update({
      nombre,
      fechaInicio,
      fechaFin,
      descripcion,
      activo
    });
    
    res.json(periodo);
  } catch (error) {
    handleError(res, error, 'Error al actualizar periodo académico');
  }
};

// Eliminar un periodo académico
export const deletePeriodoAcademico = async (req, res) => {
  try {
    const { id } = req.params;
    
    const periodo = await PeriodoAcademico.findByPk(id);
    
    if (!periodo) {
      return res.status(404).json({ message: 'Periodo académico no encontrado' });
    }
    
    if (periodo.activo) {
      return res.status(400).json({ message: 'No se puede eliminar un periodo académico activo' });
    }
    
    await periodo.destroy();
    
    res.json({ message: 'Periodo académico eliminado correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar periodo académico');
  }
};