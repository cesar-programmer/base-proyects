import Joi from 'joi';

// Schema para obtener catálogo de actividad por ID
const getCatalogoActividadSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear catálogo de actividad
const createCatalogoActividadSchema = Joi.object({
  nombre: Joi.string().min(3).max(200).required(),
  descripcion: Joi.string().max(1000).allow('', null),
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'OTRA'
  ).required(),
  horas_sugeridas: Joi.number().min(0).max(168).allow(null), // Máximo 168 horas por semana
  activo: Joi.boolean().default(true),
  requiere_evidencia: Joi.boolean().default(false)
});

// Schema para actualizar catálogo de actividad
const updateCatalogoActividadSchema = Joi.object({
  nombre: Joi.string().min(3).max(200),
  descripcion: Joi.string().max(1000).allow('', null),
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'OTRA'
  ),
  horas_sugeridas: Joi.number().min(0).max(168).allow(null),
  activo: Joi.boolean(),
  requiere_evidencia: Joi.boolean()
}).min(1); // Al menos un campo debe estar presente

export {
  getCatalogoActividadSchema,
  createCatalogoActividadSchema,
  updateCatalogoActividadSchema
};