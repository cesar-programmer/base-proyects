import Joi from 'joi';

// Esquema para login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    })
});

// Esquema para registro
const registerSchema = Joi.object({
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
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
      'any.required': 'La contraseña es requerida'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'La confirmación de contraseña es requerida'
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

// Esquema para cambio de contraseña
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña actual es requerida'
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
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

// Esquema para verificación de token
const verifyTokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'El token es requerido'
    })
});

// Esquema para recuperación de contraseña
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es requerido'
    })
});

// Esquema para reseteo de contraseña
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'El token de reseteo es requerido'
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
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
  loginSchema,
  registerSchema,
  changePasswordSchema,
  verifyTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};