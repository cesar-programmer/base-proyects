import { CatalogoActividad } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';

// Obtener todas las actividades del catálogo
export const getCatalogoActividades = async (req, res) => {
  try {
    const { categoria, activo } = req.query;
    const whereClause = {};
    
    if (categoria) {
      whereClause.categoria = categoria;
    }
    
    if (activo !== undefined) {
      whereClause.activo = activo === 'true';
    }
    
    const actividades = await CatalogoActividad.findAll({
      where: whereClause,
      order: [['nombre', 'ASC']]
    });
    
    res.json(actividades);
  } catch (error) {
    handleError(res, error, 'Error al obtener catálogo de actividades');
  }
};

// Obtener una actividad del catálogo por ID
export const getCatalogoActividadById = async (req, res) => {
  try {
    const { id } = req.params;
    const actividad = await CatalogoActividad.findByPk(id);
    
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad del catálogo no encontrada' });
    }
    
    res.json(actividad);
  } catch (error) {
    handleError(res, error, 'Error al obtener actividad del catálogo');
  }
};

// Obtener actividades por categoría
export const getActividadesByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const actividades = await CatalogoActividad.findAll({
      where: { 
        categoria,
        activo: true 
      },
      order: [['nombre', 'ASC']]
    });
    
    res.json(actividades);
  } catch (error) {
    handleError(res, error, 'Error al obtener actividades por categoría');
  }
};

// Crear una nueva actividad en el catálogo
export const createCatalogoActividad = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      categoria, 
      puntos_base, 
      requiere_evidencia, 
      activo 
    } = req.body;
    
    const actividad = await CatalogoActividad.create({
      nombre,
      descripcion,
      categoria,
      puntos_base,
      requiere_evidencia: requiere_evidencia || false,
      activo: activo !== undefined ? activo : true
    });
    
    res.status(201).json(actividad);
  } catch (error) {
    handleError(res, error, 'Error al crear actividad en el catálogo');
  }
};

// Actualizar una actividad del catálogo
export const updateCatalogoActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      categoria, 
      puntos_base, 
      requiere_evidencia, 
      activo 
    } = req.body;
    
    const actividad = await CatalogoActividad.findByPk(id);
    
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad del catálogo no encontrada' });
    }
    
    await actividad.update({
      nombre,
      descripcion,
      categoria,
      puntos_base,
      requiere_evidencia,
      activo
    });
    
    res.json(actividad);
  } catch (error) {
    handleError(res, error, 'Error al actualizar actividad del catálogo');
  }
};

// Eliminar una actividad del catálogo
export const deleteCatalogoActividad = async (req, res) => {
  try {
    const { id } = req.params;
    
    const actividad = await CatalogoActividad.findByPk(id);
    
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad del catálogo no encontrada' });
    }
    
    await actividad.destroy();
    
    res.json({ message: 'Actividad del catálogo eliminada correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar actividad del catálogo');
  }
};

// Activar/Desactivar una actividad del catálogo
export const toggleCatalogoActividad = async (req, res) => {
  try {
    const { id } = req.params;
    
    const actividad = await CatalogoActividad.findByPk(id);
    
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad del catálogo no encontrada' });
    }
    
    await actividad.update({ activo: !actividad.activo });
    
    res.json({
      message: `Actividad ${actividad.activo ? 'activada' : 'desactivada'} correctamente`,
      actividad
    });
  } catch (error) {
    handleError(res, error, 'Error al cambiar estado de la actividad');
  }
};