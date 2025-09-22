import Joi from 'joi';

// Schema para obtener actividad por ID
const getActividadSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear actividad planificada (sin reporte)
const createActividadPlanificadaSchema = Joi.object({
  nombre: Joi.string().min(3).max(255).required(),
  descripcion: Joi.string().max(1000).allow('', null),
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'CAPACITACION',
    'CAPACITACIÓN',
    'TUTORIAS',
    'GESTION_ACADEMICA',
    'POSGRADO',
    'OTRA'
  ).required(),
  fecha_inicio: Joi.date().iso().required(),
  fecha_fin: Joi.date().iso().min(Joi.ref('fecha_inicio')).required(),
  horas_dedicadas: Joi.number().min(0).max(168).allow(null),
  observaciones: Joi.string().max(1000).allow('', null)
});

// Schema para crear actividad (con reporte - mantener compatibilidad)
const createActividadSchema = Joi.object({
  id_reporte: Joi.number().integer().positive().required(),
  nombre: Joi.string().min(3).max(200).required(),
  descripcion: Joi.string().max(1000).allow('', null),
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'CAPACITACION',
    'CAPACITACIÓN',
    'TUTORIAS',
    'GESTION_ACADEMICA',
    'POSGRADO',
    'OTRA'
  ).required(),
  fecha_inicio: Joi.date().iso().required(),
  fecha_fin: Joi.date().iso().min(Joi.ref('fecha_inicio')).required(),
  horas_dedicadas: Joi.number().min(0).max(168).allow(null), // Máximo 168 horas por semana
  realizada: Joi.boolean().default(false),
  observaciones: Joi.string().max(500).allow('', null),
  evidencias: Joi.string().max(500).allow('', null)
});

// Schema para actualizar actividad
const updateActividadSchema = Joi.object({
  nombre: Joi.string().min(3).max(200),
  descripcion: Joi.string().max(1000).allow('', null),
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'CAPACITACION',
    'CAPACITACIÓN',
    'TUTORIAS',
    'GESTION_ACADEMICA',
    'POSGRADO',
    'OTRA'
  ),
  fecha_inicio: Joi.date().iso(),
  fecha_fin: Joi.date().iso().when('fecha_inicio', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('fecha_inicio')),
    otherwise: Joi.date()
  }),
  horas_dedicadas: Joi.number().min(0).max(168).allow(null),
  realizada: Joi.boolean(),
  observaciones: Joi.string().max(500).allow('', null),
  evidencias: Joi.string().max(500).allow('', null)
}).min(1); // Al menos un campo debe estar presente

// Schema para obtener actividades por reporte
const getActividadesByReporteSchema = Joi.object({
  id_reporte: Joi.number().integer().positive().required(),
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'CAPACITACION',
    'CAPACITACIÓN',
    'TUTORIAS',
    'GESTION_ACADEMICA',
    'POSGRADO',
    'OTRA'
  ).optional(),
  realizada: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

// Schema para obtener actividades por categoría
const getActividadesByCategoriaSchema = Joi.object({
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'CAPACITACION',
    'CAPACITACIÓN',
    'TUTORIAS',
    'GESTION_ACADEMICA',
    'POSGRADO',
    'OTRA'
  ).required(),
  realizada: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

// Schema para query de actividades con filtros
const queryActividadesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  categoria: Joi.string().valid(
    'DOCENCIA',
    'INVESTIGACION',
    'EXTENSION',
    'ADMINISTRATIVA',
    'CAPACITACION',
    'CAPACITACIÓN',
    'TUTORIAS',
    'GESTION_ACADEMICA',
    'POSGRADO',
    'OTRA'
  ).optional(),
  realizada: Joi.boolean().optional(),
  id_reporte: Joi.number().integer().positive().optional(),
  fecha_inicio: Joi.date().iso().optional(),
  fecha_fin: Joi.date().iso().optional(),
  search: Joi.string().max(100).optional() // Búsqueda en nombre y descripción
});

// Schema para actualizar estado de realización
const updateRealizacionSchema = Joi.object({
  realizada: Joi.boolean().required(),
  observaciones: Joi.string().max(500).allow('', null)
});

// Schema para agregar actividades desde catálogo
const addFromCatalogoSchema = Joi.object({
  id_reporte: Joi.number().integer().positive().required(),
  actividades_catalogo: Joi.array().items(
    Joi.object({
      id_actividad_catalogo: Joi.number().integer().positive().required(),
      fecha_inicio: Joi.date().iso().required(),
      fecha_fin: Joi.date().iso().required(),
      horas_dedicadas: Joi.number().min(0).max(168).allow(null),
      observaciones: Joi.string().max(500).allow('', null)
    })
  ).min(1).max(20).required() // Máximo 20 actividades por vez
});

export {
  getActividadSchema,
  createActividadSchema,
  createActividadPlanificadaSchema,
  updateActividadSchema,
  getActividadesByReporteSchema,
  getActividadesByCategoriaSchema,
  queryActividadesSchema,
  updateRealizacionSchema,
  addFromCatalogoSchema
};