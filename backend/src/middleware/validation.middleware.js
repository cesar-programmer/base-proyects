import { validatorHandler } from './validation_handler.js';
import {
  createActividadSchema,
  updateActividadSchema,
  getActividadSchema
} from '../schemas/actividad.schema.js';
import {
  createReporteSchema,
  updateReporteSchema,
  getReporteSchema
} from '../schemas/reporte.schema.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema
} from '../schemas/user.schema.js';
import {
  loginSchema,
  registerSchema
} from '../schemas/auth.schema.js';
import {
  uploadFileSchema
} from '../schemas/file.schema.js';
import {
  createPermisoSchema,
  updatePermisoSchema
} from '../schemas/permiso.schema.js';
import {
  createPeriodoAcademicoSchema,
  updatePeriodoAcademicoSchema
} from '../schemas/periodoAcademico.schema.js';
import {
  createCatalogoActividadSchema,
  updateCatalogoActividadSchema
} from '../schemas/catalogoActividad.schema.js';
import {
  createFechaLimiteSchema,
  updateFechaLimiteSchema
} from '../schemas/fechaLimite.schema.js';
import {
  createNotificacionSchema
} from '../schemas/notificacion.schema.js';
import {
  createHistorialCambioSchema
} from '../schemas/historialCambio.schema.js';
import {
  createConfiguracionSchema,
  updateConfiguracionSchema
} from '../schemas/configuracion.schema.js';

// Validaciones para actividades
export const validateActividad = validatorHandler(createActividadSchema, 'body');
export const validateUpdateActividad = validatorHandler(updateActividadSchema, 'body');
export const validateGetActividad = validatorHandler(getActividadSchema, 'params');

// Validaciones para reportes
export const validateReporte = validatorHandler(createReporteSchema, 'body');
export const validateUpdateReporte = validatorHandler(updateReporteSchema, 'body');
export const validateGetReporte = validatorHandler(getReporteSchema, 'params');

// Validaciones para usuarios
export const validateUser = validatorHandler(createUserSchema, 'body');
export const validateUpdateUser = validatorHandler(updateUserSchema, 'body');
export const validateGetUser = validatorHandler(getUserSchema, 'params');

// Validaciones para autenticación
export const validateLogin = validatorHandler(loginSchema, 'body');
export const validateRegister = validatorHandler(registerSchema, 'body');

// Validaciones para archivos
export const validateUploadFile = validatorHandler(uploadFileSchema, 'body');

// Validaciones para permisos
export const validatePermiso = validatorHandler(createPermisoSchema, 'body');
export const validateUpdatePermiso = validatorHandler(updatePermisoSchema, 'body');

// Validaciones para períodos académicos
export const validatePeriodoAcademico = validatorHandler(createPeriodoAcademicoSchema, 'body');
export const validateUpdatePeriodoAcademico = validatorHandler(updatePeriodoAcademicoSchema, 'body');

// Validaciones para catálogo de actividades
export const validateCatalogoActividad = validatorHandler(createCatalogoActividadSchema, 'body');
export const validateUpdateCatalogoActividad = validatorHandler(updateCatalogoActividadSchema, 'body');

// Validaciones para fechas límite
export const validateFechaLimite = validatorHandler(createFechaLimiteSchema, 'body');
export const validateUpdateFechaLimite = validatorHandler(updateFechaLimiteSchema, 'body');

// Validaciones para notificaciones
export const validateNotificacion = validatorHandler(createNotificacionSchema, 'body');

// Validaciones para historial de cambios
export const validateHistorialCambio = validatorHandler(createHistorialCambioSchema, 'body');

// Validaciones para configuraciones
export const validateConfiguracion = validatorHandler(createConfiguracionSchema, 'body');
export const validateUpdateConfiguracion = validatorHandler(updateConfiguracionSchema, 'body');