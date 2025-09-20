import boom from '@hapi/boom';
import { ActividadService, ReporteService } from '../services/index.js';
import { handleError } from '../utils/errorHandler.js';

const actividadService = new ActividadService();
const reporteService = new ReporteService();

// Obtener todas las actividades
export const getActividades = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, categoria, estado_realizado, id_reporte } = req.query;
    const filters = {};
    
    if (categoria) filters.categoria = categoria;
    if (estado_realizado) filters.estado_realizado = estado_realizado;
    if (id_reporte) filters.id_reporte = parseInt(id_reporte);

    const actividades = await actividadService.find({
      page: parseInt(page),
      limit: parseInt(limit),
      ...filters
    });

    res.json({
      message: 'Actividades obtenidas exitosamente',
      data: actividades
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Obtener actividad por ID
export const getActividadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actividad = await actividadService.findOne(id);
    
    res.json({
      message: 'Actividad obtenida exitosamente',
      data: actividad
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Obtener actividades por usuario
export const getActividadesByUsuario = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const actividades = await actividadService.findByUsuario(id_usuario, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json({
      message: 'Actividades del usuario obtenidas exitosamente',
      data: actividades
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Obtener actividades por reporte
export const getActividadesByReporte = async (req, res, next) => {
  try {
    const { id_reporte } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const actividades = await actividadService.findByReporte(id_reporte, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json({
      message: 'Actividades del reporte obtenidas exitosamente',
      data: actividades
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Crear nueva actividad
export const createActividad = async (req, res, next) => {
  try {
    const actividadData = req.body;
    
    // Validar que el usuario tenga permisos para crear actividades en el reporte
    if (actividadData.id_reporte) {
      const reporte = await reporteService.findOne(actividadData.id_reporte);
      
      if (reporte.id_docente !== req.user.id) {
        throw boom.forbidden('No tienes permisos para crear actividades en este reporte');
      }
    }
    
    const newActividad = await actividadService.create({
      ...actividadData,
      id_usuario: req.user.id
    });
    
    res.status(201).json({
      message: 'Actividad creada exitosamente',
      data: newActividad
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Actualizar actividad
export const updateActividad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar que la actividad existe y el usuario tiene permisos
    const actividad = await actividadService.findOne(id);
    
    if (actividad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
      throw boom.forbidden('No tienes permisos para actualizar esta actividad');
    }
    
    const updatedActividad = await actividadService.update(id, updateData);
    
    res.json({
      message: 'Actividad actualizada exitosamente',
      data: updatedActividad
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Eliminar actividad
export const deleteActividad = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar que la actividad existe y el usuario tiene permisos
    const actividad = await actividadService.findOne(id);
    
    if (actividad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
      throw boom.forbidden('No tienes permisos para eliminar esta actividad');
    }
    
    await actividadService.delete(id);
    
    res.json({
      message: 'Actividad eliminada exitosamente'
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Aprobar actividad
export const aprobarActividad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;
    const result = await actividadService.approve(id, comentarios || '');
    
    res.json({
      message: 'Actividad aprobada exitosamente',
      data: result.data
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Rechazar actividad
export const rechazarActividad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    if (!motivo) {
      throw boom.badRequest('El motivo es requerido para rechazar la actividad');
    }

    const result = await actividadService.reject(id, motivo);
    
    res.json({
      message: 'Actividad rechazada exitosamente',
      data: result.data
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Actualizar estado de actividad
export const actualizarEstadoActividad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado_realizado } = req.body;
    
    const result = await actividadService.updateRealizationStatus(id, estado_realizado);
    
    res.json({
      message: 'Estado de realización actualizado exitosamente',
      data: result
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Obtener estadísticas de actividades
export const getEstadisticasActividades = async (req, res, next) => {
  try {
    const estadisticas = await actividadService.getActivityStatsByStatus();
    
    res.json({
      message: 'Estadísticas de actividades obtenidas exitosamente',
      data: estadisticas
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Obtener actividades pendientes de revisión para el dashboard
export const getActividadesPendientesDashboard = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const actividades = await actividadService.getPendingActivitiesForDashboard(limit);
    res.json(actividades);
  } catch (error) {
    next(error);
  }
};