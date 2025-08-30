import Joi from 'joi';

// Schema para subir archivo
const uploadFileSchema = Joi.object({
  description: Joi.string().max(500).allow('', null),
  category: Joi.string().valid(
    'reporte',
    'actividad',
    'evidencia',
    'documento'
  ).optional()
});

// Schema para eliminar archivo
const deleteFileSchema = Joi.object({
  filename: Joi.string().pattern(/^[a-zA-Z0-9._-]+$/).required()
});

// Schema para descargar archivo
const downloadFileSchema = Joi.object({
  filename: Joi.string().pattern(/^[a-zA-Z0-9._-]+$/).required()
});

// Schema para listar archivos
const listFilesSchema = Joi.object({
  type: Joi.string().valid('all', 'reportes', 'actividades', 'evidencias', 'temp').default('all'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export {
  uploadFileSchema,
  deleteFileSchema,
  downloadFileSchema,
  listFilesSchema
};