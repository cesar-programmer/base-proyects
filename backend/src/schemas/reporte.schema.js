import Joi from 'joi';

// Esquema para obtener reporte por ID
const getReporteSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser un número positivo',
      'any.required': 'El ID es requerido'
    })
});

// Esquema para crear reporte
const createReporteSchema = Joi.object({
  id_docente: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El ID del docente debe ser un número',
      'number.integer': 'El ID del docente debe ser un número entero',
      'number.positive': 'El ID del docente debe ser un número positivo'
    }),
  id_periodo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del período debe ser un número',
      'number.integer': 'El ID del período debe ser un número entero',
      'number.positive': 'El ID del período debe ser un número positivo',
      'any.required': 'El período académico es requerido'
    }),
  tipo: Joi.string()
    .valid('ACTIVIDADES_PLANIFICADAS', 'ACTIVIDADES_REALIZADAS')
    .required()
    .messages({
      'any.only': 'El tipo debe ser ACTIVIDADES_PLANIFICADAS o ACTIVIDADES_REALIZADAS',
      'any.required': 'El tipo de reporte es requerido'
    }),
  semestre: Joi.number()
    .integer()
    .min(1)
    .max(2)
    .required()
    .messages({
      'number.base': 'El semestre debe ser un número',
      'number.integer': 'El semestre debe ser un número entero',
      'number.min': 'El semestre debe ser 1 o 2',
      'number.max': 'El semestre debe ser 1 o 2',
      'any.required': 'El semestre es requerido'
    }),
  observaciones_admin: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    })
});

// Esquema para actualizar reporte
const updateReporteSchema = Joi.object({
  id_periodo: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El ID del período debe ser un número',
      'number.integer': 'El ID del período debe ser un número entero',
      'number.positive': 'El ID del período debe ser un número positivo'
    }),
  tipo: Joi.string()
    .valid('ACTIVIDADES_PLANIFICADAS', 'ACTIVIDADES_REALIZADAS')
    .messages({
      'any.only': 'El tipo debe ser ACTIVIDADES_PLANIFICADAS o ACTIVIDADES_REALIZADAS'
    }),
  semestre: Joi.number()
    .integer()
    .min(1)
    .max(2)
    .messages({
      'number.base': 'El semestre debe ser un número',
      'number.integer': 'El semestre debe ser un número entero',
      'number.min': 'El semestre debe ser 1 o 2',
      'number.max': 'El semestre debe ser 1 o 2'
    }),
  observaciones_admin: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Esquema para cambiar estado del reporte
const changeReporteStatusSchema = Joi.object({
  estado: Joi.string()
    .valid('BORRADOR', 'ENVIADO', 'EN_REVISION', 'APROBADO', 'DEVUELTO')
    .required()
    .messages({
      'any.only': 'El estado debe ser BORRADOR, ENVIADO, EN_REVISION, APROBADO o DEVUELTO',
      'any.required': 'El estado es requerido'
    }),
  observaciones_admin: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    })
});

// Esquema para obtener reportes por docente
const getReportesByDocenteSchema = Joi.object({
  docenteId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del docente debe ser un número',
      'number.integer': 'El ID del docente debe ser un número entero',
      'number.positive': 'El ID del docente debe ser un número positivo',
      'any.required': 'El ID del docente es requerido'
    })
});

// Esquema para obtener reportes por período
const getReportesByPeriodSchema = Joi.object({
  periodId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del período debe ser un número',
      'number.integer': 'El ID del período debe ser un número entero',
      'number.positive': 'El ID del período debe ser un número positivo',
      'any.required': 'El ID del período es requerido'
    })
});

// Esquema para query parameters de búsqueda de reportes
const getReportesQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'La página debe ser un número',
      'number.integer': 'La página debe ser un número entero',
      'number.min': 'La página debe ser mayor a 0'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un número entero',
      'number.min': 'El límite debe ser mayor a 0',
      'number.max': 'El límite no puede ser mayor a 100'
    }),
  estado: Joi.string()
    .valid('BORRADOR', 'ENVIADO', 'EN_REVISION', 'APROBADO', 'DEVUELTO')
    .messages({
      'any.only': 'El estado debe ser BORRADOR, ENVIADO, EN_REVISION, APROBADO o DEVUELTO'
    }),
  tipo: Joi.string()
    .valid('ACTIVIDADES_PLANIFICADAS', 'ACTIVIDADES_REALIZADAS')
    .messages({
      'any.only': 'El tipo debe ser ACTIVIDADES_PLANIFICADAS o ACTIVIDADES_REALIZADAS'
    }),
  id_periodo: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El filtro de período debe ser un número',
      'number.integer': 'El filtro de período debe ser un número entero',
      'number.positive': 'El filtro de período debe ser un número positivo'
    }),
  id_docente: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El filtro de docente debe ser un número',
      'number.integer': 'El filtro de docente debe ser un número entero',
      'number.positive': 'El filtro de docente debe ser un número positivo'
    }),
  semestre: Joi.number()
    .integer()
    .min(1)
    .max(2)
    .messages({
      'number.base': 'El filtro de semestre debe ser un número',
      'number.integer': 'El filtro de semestre debe ser un número entero',
      'number.min': 'El filtro de semestre debe ser 1 o 2',
      'number.max': 'El filtro de semestre debe ser 1 o 2'
    })
});

// Esquema para enviar reporte
const sendReporteSchema = Joi.object({
  observaciones: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    })
});

export {
  getReporteSchema,
  createReporteSchema,
  updateReporteSchema,
  changeReporteStatusSchema,
  getReportesByDocenteSchema,
  getReportesByPeriodSchema,
  getReportesQuerySchema,
  sendReporteSchema
};