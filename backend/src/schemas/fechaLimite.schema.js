import Joi from 'joi';

// Schema para obtener fecha límite por ID
const getFechaLimiteSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear fecha límite
const createFechaLimiteSchema = Joi.object({
  nombre: Joi.string().min(3).max(255).required(),
  descripcion: Joi.string().max(1000).allow('', null),
  fecha_limite: Joi.date().iso().required(),
  categoria: Joi.string().valid(
    'REGISTRO',
    'ENTREGA'
  ).required(),
  id_periodo: Joi.number().integer().positive().required(),
  semestre: Joi.string().max(10).allow('', null),
  dias_recordatorio: Joi.number().integer().min(0).max(365).default(7),
  activo: Joi.boolean().default(true)
});

// Schema para actualizar fecha límite
const updateFechaLimiteSchema = Joi.object({
  nombre: Joi.string().min(3).max(255),
  descripcion: Joi.string().max(1000).allow('', null),
  fecha_limite: Joi.date().iso(),
  categoria: Joi.string().valid(
    'REGISTRO',
    'ENTREGA'
  ),
  id_periodo: Joi.number().integer().positive(),
  semestre: Joi.string().max(10).allow('', null),
  dias_recordatorio: Joi.number().integer().min(0).max(365),
  activo: Joi.boolean()
}).min(1); // Al menos un campo debe estar presente

export {
  getFechaLimiteSchema,
  createFechaLimiteSchema,
  updateFechaLimiteSchema
};