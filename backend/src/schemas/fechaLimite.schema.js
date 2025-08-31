import Joi from 'joi';

// Schema para obtener fecha límite por ID
const getFechaLimiteSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear fecha límite
const createFechaLimiteSchema = Joi.object({
  nombre: Joi.string().min(3).max(200).required(),
  descripcion: Joi.string().max(1000).allow('', null),
  fecha_limite: Joi.date().iso().required(),
  tipo: Joi.string().valid(
    'ENTREGA_REPORTE',
    'REVISION',
    'APROBACION',
    'PUBLICACION',
    'OTRO'
  ).required(),
  activo: Joi.boolean().default(true),
  notificar_dias_antes: Joi.number().integer().min(0).max(365).default(7)
});

// Schema para actualizar fecha límite
const updateFechaLimiteSchema = Joi.object({
  nombre: Joi.string().min(3).max(200),
  descripcion: Joi.string().max(1000).allow('', null),
  fecha_limite: Joi.date().iso(),
  tipo: Joi.string().valid(
    'ENTREGA_REPORTE',
    'REVISION',
    'APROBACION',
    'PUBLICACION',
    'OTRO'
  ),
  activo: Joi.boolean(),
  notificar_dias_antes: Joi.number().integer().min(0).max(365)
}).min(1); // Al menos un campo debe estar presente

export {
  getFechaLimiteSchema,
  createFechaLimiteSchema,
  updateFechaLimiteSchema
};