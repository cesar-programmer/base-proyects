import Joi from 'joi';

// Schema para obtener historial de cambio por ID
const getHistorialCambioSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear historial de cambio
const createHistorialCambioSchema = Joi.object({
  id_reporte: Joi.number().integer().positive().required(),
  id_usuario: Joi.number().integer().positive().required(),
  accion: Joi.string().valid(
    'CREADO',
    'ACTUALIZADO',
    'ELIMINADO',
    'APROBADO',
    'RECHAZADO',
    'ENVIADO',
    'DEVUELTO'
  ).required(),
  descripcion: Joi.string().max(1000).allow('', null),
  valores_anteriores: Joi.object().allow(null),
  valores_nuevos: Joi.object().allow(null)
});

// Schema para actualizar historial de cambio
const updateHistorialCambioSchema = Joi.object({
  accion: Joi.string().valid(
    'CREADO',
    'ACTUALIZADO',
    'ELIMINADO',
    'APROBADO',
    'RECHAZADO',
    'ENVIADO',
    'DEVUELTO'
  ),
  descripcion: Joi.string().max(1000).allow('', null),
  valores_anteriores: Joi.object().allow(null),
  valores_nuevos: Joi.object().allow(null)
}).min(1); // Al menos un campo debe estar presente

export {
  getHistorialCambioSchema,
  createHistorialCambioSchema,
  updateHistorialCambioSchema
};