import Joi from 'joi';

// Schema para obtener configuración por clave
const getConfiguracionSchema = Joi.object({
  clave: Joi.string().min(3).max(100).required()
});

// Schema para crear configuración
const createConfiguracionSchema = Joi.object({
  clave: Joi.string().min(3).max(100).required(),
  valor: Joi.string().max(1000).required(),
  descripcion: Joi.string().max(500).allow('', null),
  tipo: Joi.string().valid(
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'JSON',
    'DATE'
  ).default('STRING'),
  categoria: Joi.string().valid(
    'SISTEMA',
    'NOTIFICACIONES',
    'REPORTES',
    'USUARIOS',
    'GENERAL'
  ).default('GENERAL'),
  editable: Joi.boolean().default(true)
});

// Schema para actualizar configuración
const updateConfiguracionSchema = Joi.object({
  valor: Joi.string().max(1000),
  descripcion: Joi.string().max(500).allow('', null),
  tipo: Joi.string().valid(
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'JSON',
    'DATE'
  ),
  categoria: Joi.string().valid(
    'SISTEMA',
    'NOTIFICACIONES',
    'REPORTES',
    'USUARIOS',
    'GENERAL'
  ),
  editable: Joi.boolean()
}).min(1); // Al menos un campo debe estar presente

// Schema para actualizar solo el valor
const updateValorConfiguracionSchema = Joi.object({
  valor: Joi.string().max(1000).required()
});

// Schema para actualizar múltiples configuraciones
const updateMultiplesConfiguracionesSchema = Joi.object({
  configuraciones: Joi.array().items(
    Joi.object({
      clave: Joi.string().min(3).max(100).required(),
      valor: Joi.string().max(1000).required()
    })
  ).min(1).required()
});

export {
  getConfiguracionSchema,
  createConfiguracionSchema,
  updateConfiguracionSchema,
  updateValorConfiguracionSchema,
  updateMultiplesConfiguracionesSchema
};