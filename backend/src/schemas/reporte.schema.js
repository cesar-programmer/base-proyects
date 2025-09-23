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
  titulo: Joi.string()
    .max(200)
    .required()
    .messages({
      'string.max': 'El título no puede exceder 200 caracteres',
      'any.required': 'El título es requerido'
    }),
  descripcion: Joi.string()
    .required()
    .messages({
      'any.required': 'La descripción es requerida'
    }),
  fechaRealizacion: Joi.date()
    .required()
    .messages({
      'any.required': 'La fecha de realización es requerida'
    }),
  usuarioId: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El ID del usuario debe ser un número',
      'number.integer': 'El ID del usuario debe ser un número entero',
      'number.positive': 'El ID del usuario debe ser un número positivo'
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
    }),
  actividadId: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El ID de la actividad debe ser un número',
      'number.integer': 'El ID de la actividad debe ser un número entero',
      'number.positive': 'El ID de la actividad debe ser un número positivo'
    }),
  actividades: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.number().integer().positive(),
        Joi.object({
          id: Joi.number().integer().positive().required()
        })
      )
    )
    .min(1)
    .messages({
      'array.min': 'Debe seleccionar al menos una actividad',
      'array.base': 'Las actividades deben ser un array'
    }),
  ubicacion: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'La ubicación no puede exceder 255 caracteres'
    }),
  presupuesto: Joi.number()
    .min(0)
    .messages({
      'number.base': 'El presupuesto debe ser un número',
      'number.min': 'El presupuesto no puede ser negativo'
    }),
  participantesEsperados: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Los participantes esperados deben ser un número',
      'number.integer': 'Los participantes esperados deben ser un número entero',
      'number.min': 'Los participantes esperados no pueden ser negativos'
    }),
  objetivos: Joi.string()
    .max(2000)
    .allow('')
    .messages({
      'string.max': 'Los objetivos no pueden exceder 2000 caracteres'
    }),
  recursos: Joi.string()
    .max(2000)
    .allow('')
    .messages({
      'string.max': 'Los recursos no pueden exceder 2000 caracteres'
    }),
  estado: Joi.string()
    .valid('BORRADOR', 'ENVIADO', 'EN_REVISION', 'APROBADO', 'RECHAZADO')
    .messages({
      'any.only': 'El estado debe ser uno de: BORRADOR, ENVIADO, EN_REVISION, APROBADO, RECHAZADO'
    })
});

// Esquema para actualizar reporte
const updateReporteSchema = Joi.object({
  titulo: Joi.string()
    .max(200)
    .messages({
      'string.max': 'El título no puede exceder 200 caracteres'
    }),
  descripcion: Joi.string()
    .messages({
      'string.base': 'La descripción debe ser texto'
    }),
  fechaRealizacion: Joi.date()
    .messages({
      'date.base': 'La fecha de realización debe ser una fecha válida'
    }),
  estado: Joi.string()
    .valid('borrador', 'enviado', 'revisado', 'aprobado', 'rechazado')
    .messages({
      'any.only': 'El estado debe ser borrador, enviado, revisado, aprobado o rechazado'
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
  usuarioId: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El filtro de usuario debe ser un número',
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

// Esquema para obtener historial de reportes
const getReportHistorySchema = Joi.object({
  docenteId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del docente debe ser un número',
      'number.integer': 'El ID del docente debe ser un número entero',
      'number.positive': 'El ID del docente debe ser un número positivo',
      'any.required': 'El ID del docente es requerido'
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
  fechaInicio: Joi.date()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida'
    }),
  fechaFin: Joi.date()
    .messages({
      'date.base': 'La fecha de fin debe ser una fecha válida'
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
  sendReporteSchema,
  getReportHistorySchema
};