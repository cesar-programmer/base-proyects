import Joi from 'joi';

// Esquema para obtener usuario por ID
const getUserSchema = Joi.object({
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

// Esquema para crear usuario
const createUserSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
  apellido: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 100 caracteres',
      'any.required': 'El apellido es requerido'
    }),
  email: Joi.string()
    .email()
    .max(150)
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'string.max': 'El email no puede exceder 150 caracteres',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)'))
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La contraseña es requerida'
    }),
  cedula: Joi.string()
    .max(20)
    .required()
    .messages({
      'string.max': 'La cédula no puede exceder 20 caracteres',
      'any.required': 'La cédula es requerida'
    }),
  telefono: Joi.string()
    .max(20)
    .optional()
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  fechaNacimiento: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida'
    }),
  direccion: Joi.string()
    .optional()
    .messages({
      'string.base': 'La dirección debe ser texto'
    }),
  rolId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El rol debe ser un número',
      'number.integer': 'El rol debe ser un número entero',
      'number.positive': 'El rol debe ser un número positivo',
      'any.required': 'El rol es requerido'
    }),
  activo: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso'
    })
});

// Esquema para actualizar usuario (admin)
const updateUserSchema = Joi.object({
  nombre_completo: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'El email debe tener un formato válido'
    }),
  id_rol: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El rol debe ser un número',
      'number.integer': 'El rol debe ser un número entero',
      'number.positive': 'El rol debe ser un número positivo'
    }),
  activo: Joi.boolean()
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Esquema para actualizar perfil (usuario autenticado)
const updateProfileSchema = Joi.object({
  nombre_completo: Joi.string()
    .min(2)
    .max(255)
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 255 caracteres'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'El email debe tener un formato válido'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// Esquema para obtener usuarios por rol
const getUsersByRoleSchema = Joi.object({
  roleId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del rol debe ser un número',
      'number.integer': 'El ID del rol debe ser un número entero',
      'number.positive': 'El ID del rol debe ser un número positivo',
      'any.required': 'El ID del rol es requerido'
    })
});

// Esquema para query parameters de búsqueda de usuarios
const getUsersQuerySchema = Joi.object({
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
  activo: Joi.boolean()
    .messages({
      'boolean.base': 'El filtro activo debe ser verdadero o falso'
    }),
  id_rol: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El filtro de rol debe ser un número',
      'number.integer': 'El filtro de rol debe ser un número entero',
      'number.positive': 'El filtro de rol debe ser un número positivo'
    }),
  search: Joi.string()
    .min(1)
    .max(255)
    .messages({
      'string.min': 'El término de búsqueda debe tener al menos 1 caracter',
      'string.max': 'El término de búsqueda no puede exceder 255 caracteres'
    })
});

// Esquema para cambio de contraseña de usuario específico (admin)
const changeUserPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)'))
    .required()
    .messages({
      'string.min': 'La nueva contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La nueva contraseña es requerida'
    }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'La confirmación de la nueva contraseña es requerida'
    })
});

export {
  getUserSchema,
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  getUsersByRoleSchema,
  getUsersQuerySchema,
  changeUserPasswordSchema
};