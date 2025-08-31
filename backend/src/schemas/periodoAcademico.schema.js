import Joi from 'joi';

// Schema para obtener período académico por ID
const getPeriodoAcademicoSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear período académico
const createPeriodoAcademicoSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().max(500).allow('', null),
  fechaInicio: Joi.date().iso().required(),
  fechaFin: Joi.date().iso().min(Joi.ref('fechaInicio')).required(),
  activo: Joi.boolean().default(false)
});

// Schema para actualizar período académico
const updatePeriodoAcademicoSchema = Joi.object({
  nombre: Joi.string().min(3).max(100),
  descripcion: Joi.string().max(500).allow('', null),
  fechaInicio: Joi.date().iso(),
  fechaFin: Joi.date().iso().when('fechaInicio', {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref('fechaInicio')),
    otherwise: Joi.date()
  }),
  activo: Joi.boolean()
}).min(1); // Al menos un campo debe estar presente

export {
  getPeriodoAcademicoSchema,
  createPeriodoAcademicoSchema,
  updatePeriodoAcademicoSchema
};