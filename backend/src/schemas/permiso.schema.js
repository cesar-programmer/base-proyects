import Joi from 'joi';

// Schema para obtener permiso por ID
const getPermisoSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Schema para crear permiso
const createPermisoSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().max(500).allow('', null),
  activo: Joi.boolean().default(true)
});

// Schema para actualizar permiso
const updatePermisoSchema = Joi.object({
  nombre: Joi.string().min(3).max(100),
  descripcion: Joi.string().max(500).allow('', null),
  activo: Joi.boolean()
}).min(1); // Al menos un campo debe estar presente

export {
  getPermisoSchema,
  createPermisoSchema,
  updatePermisoSchema
};