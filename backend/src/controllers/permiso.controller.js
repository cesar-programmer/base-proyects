import { Permiso } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';

// Obtener todos los permisos
export const getPermisos = async (req, res) => {
  try {
    const permisos = await Permiso.findAll({
      order: [['nombre', 'ASC']]
    });
    res.json(permisos);
  } catch (error) {
    handleError(res, error, 'Error al obtener permisos');
  }
};

// Obtener un permiso por ID
export const getPermisoById = async (req, res) => {
  try {
    const { id } = req.params;
    const permiso = await Permiso.findByPk(id);
    
    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }
    
    res.json(permiso);
  } catch (error) {
    handleError(res, error, 'Error al obtener permiso');
  }
};

// Crear un nuevo permiso
export const createPermiso = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    const permiso = await Permiso.create({
      nombre,
      descripcion
    });
    
    res.status(201).json(permiso);
  } catch (error) {
    handleError(res, error, 'Error al crear permiso');
  }
};

// Actualizar un permiso
export const updatePermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    
    const permiso = await Permiso.findByPk(id);
    
    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }
    
    await permiso.update({
      nombre,
      descripcion
    });
    
    res.json(permiso);
  } catch (error) {
    handleError(res, error, 'Error al actualizar permiso');
  }
};

// Eliminar un permiso
export const deletePermiso = async (req, res) => {
  try {
    const { id } = req.params;
    
    const permiso = await Permiso.findByPk(id);
    
    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }
    
    await permiso.destroy();
    
    res.json({ message: 'Permiso eliminado correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar permiso');
  }
};