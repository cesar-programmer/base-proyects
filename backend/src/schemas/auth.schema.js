const Joi = require('joi');

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
  nombre_completo: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 255 caracteres',
      'any.required': 'El nombre completo es requerido'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
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
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'La confirmación de contraseña es requerida'
    }),
  id_rol: Joi.number()
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

module.exports = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  verifyTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};