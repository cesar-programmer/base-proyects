import Joi from 'joi';

// Schema para obtener notificación por ID
const getNotificacionSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear notificación
const createNotificacionSchema = Joi.object({
  id_usuario: Joi.number().integer().positive().required(),
  id_fecha_limite: Joi.number().integer().positive().allow(null),
  titulo: Joi.string().min(3).max(200).required(),
  mensaje: Joi.string().max(1000).required(),
  tipo: Joi.string().valid(
    'INFO',
    'WARNING',
    'ERROR',
    'SUCCESS',
    'REMINDER'
  ).default('INFO'),
  leida: Joi.boolean().default(false)
});

// Schema para actualizar notificación
const updateNotificacionSchema = Joi.object({
  titulo: Joi.string().min(3).max(200),
  mensaje: Joi.string().max(1000),
  tipo: Joi.string().valid(
    'INFO',
    'WARNING',
    'ERROR',
    'SUCCESS',
    'REMINDER'
  ),
  leida: Joi.boolean()
}).min(1); // Al menos un campo debe estar presente

export {
  getNotificacionSchema,
  createNotificacionSchema,
  updateNotificacionSchema
};