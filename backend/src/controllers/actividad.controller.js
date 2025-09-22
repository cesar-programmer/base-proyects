import boom from '@hapi/boom';
import { ActividadService, ReporteService } from '../services/index.js';
import { PeriodoAcademico } from '../models/index.js';
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
    const { usuarioId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const actividades = await actividadService.findByUsuario(usuarioId, {
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
      usuarioId: req.user.id
    });
    
    res.status(201).json({
      message: 'Actividad creada exitosamente',
      data: newActividad
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Crear nueva actividad planificada (sin reporte)
export const createActividadPlanificada = async (req, res, next) => {
  try {
    const { 
      nombre, 
      descripcion, 
      categoria, 
      fecha_inicio, 
      fecha_fin, 
      horas_dedicadas, 
      ubicacion, 
      presupuesto, 
      participantesEsperados, 
      objetivos, 
      recursos, 
      observaciones 
    } = req.body;
    
    // Obtener el período académico activo
    const periodoActivo = await PeriodoAcademico.findOne({
      where: { activo: true }
    });

    if (!periodoActivo) {
      return res.status(400).json({
        message: 'No hay un período académico activo configurado'
      });
    }
    
    // Mapear los campos del frontend al modelo de base de datos
    const actividadData = {
      titulo: nombre,
      descripcion,
      categoria,
      fechaInicio: fecha_inicio,
      fechaFin: fecha_fin,
      ubicacion,
      presupuesto: presupuesto ? parseFloat(presupuesto) : null,
      participantesEsperados: participantesEsperados ? parseInt(participantesEsperados) : null,
      objetivos,
      recursos,
      observaciones_planificacion: observaciones,
      usuarioId: req.user.id,
      periodoAcademicoId: periodoActivo.id,
      estado_planificacion: 'borrador'
    };
    
    const newActividad = await actividadService.create(actividadData);
    
    res.status(201).json({
      message: 'Actividad planificada creada exitosamente',
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
    
    if (actividad.usuarioId !== req.user.id && req.user.rol !== 'admin') {
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
    
    if (actividad.usuarioId !== req.user.id && req.user.rol !== 'admin') {
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

// Obtener actividades devueltas para correcciones pendientes
export const getActividadesDevueltas = async (req, res, next) => {
  try {
    const filters = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      searchTerm: req.query.search || '',
      period: req.query.period || '',
      dateFrom: req.query.dateFrom || '',
      dateTo: req.query.dateTo || ''
    };

    const result = await actividadService.getReturnedActivities(filters);
    
    res.json({
      message: 'Actividades devueltas obtenidas exitosamente',
      ...result
    });
  } catch (error) {
    handleError(error, next);
  }
};

// Enviar planificación de actividades
export const enviarPlanificacion = async (req, res, next) => {
  try {
    console.log('🔍 [enviarPlanificacion] Request body recibido:', req.body);
    console.log('🔍 [enviarPlanificacion] Request headers:', req.headers);
    console.log('🔍 [enviarPlanificacion] Request params:', req.params);
    console.log('🔍 [enviarPlanificacion] Request query:', req.query);

    const { actividades, periodo, observaciones } = req.body;
    const usuarioId = req.user.id;

    console.log('🔍 [enviarPlanificacion] Datos extraídos:', {
      usuarioId,
      actividades,
      periodo,
      observaciones
    });

    // Validar que se envíen actividades
    if (!actividades || !Array.isArray(actividades) || actividades.length === 0) {
      return res.status(400).json({
        message: 'Debe incluir al menos una actividad en la planificación'
      });
    }

    // Validar que se especifique el período
    if (!periodo) {
      return res.status(400).json({
        message: 'Debe especificar el período de la planificación'
      });
    }

    console.log('🔍 [enviarPlanificacion] Llamando al servicio submitPlanification...');

    // Enviar la planificación usando el servicio
    const result = await actividadService.submitPlanification({
      usuarioId,
      actividades,
      periodo,
      observaciones: observaciones || ''
    });

    console.log('✅ [enviarPlanificacion] Servicio ejecutado exitosamente:', result);

    res.status(201).json({
      message: 'Planificación enviada exitosamente',
      data: result
    });
  } catch (error) {
    console.log('❌ [enviarPlanificacion] Error capturado:', error);
    console.log('❌ [enviarPlanificacion] Error stack:', error.stack);
    handleError(error, next);
  }
};