import boom from '@hapi/boom';

/**
 * Maneja errores de forma consistente en los controladores.
 * Soporta dos firmas:
 *  - handleError(error, next)
 *  - handleError(res, error, [mensaje])
 *
 * @param {Error|import('express').Response} arg1 - Error o Response
 * @param {Function|Error} arg2 - Next o Error
 * @param {string} [defaultMessage] - Mensaje por defecto para respuesta directa
 */
export const handleError = (arg1, arg2, defaultMessage = 'Error interno del servidor') => {
  const usingNext = typeof arg2 === 'function';
  const error = usingNext ? arg1 : arg2;
  const next = usingNext ? arg2 : null;
  const res = usingNext ? null : arg1;

  const respond = (statusCode, payload) => {
    if (usingNext) {
      return next(boom.boomify(new Error(payload.message || defaultMessage), { statusCode, data: payload.data }));
    }
    return res.status(statusCode).json(payload);
  };

  // Si ya es un error de Boom
  if (boom.isBoom(error)) {
    if (usingNext) return next(error);
    const { statusCode, payload } = error.output;
    return res.status(statusCode).json(payload);
  }

  // Errores de validación de Sequelize
  if (error?.name === 'SequelizeValidationError') {
    const validationErrors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    return respond(400, { message: 'Errores de validación', data: { errors: validationErrors } });
  }

  // Errores de clave única de Sequelize
  if (error?.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0]?.path || 'campo';
    return respond(409, { message: `El ${field} ya existe` });
  }

  // Errores de clave foránea de Sequelize
  if (error?.name === 'SequelizeForeignKeyConstraintError') {
    return respond(400, { message: 'Referencia inválida a otro registro' });
  }

  // Errores de base de datos de Sequelize
  if (error?.name === 'SequelizeDatabaseError') {
    return respond(500, { message: 'Error en la base de datos' });
  }

  // Error de conexión a la base de datos
  if (error?.name === 'SequelizeConnectionError') {
    return respond(500, { message: 'Error de conexión a la base de datos' });
  }

  // Errores de timeout
  if (error?.name === 'SequelizeTimeoutError') {
    return respond(504, { message: 'Timeout en la operación de base de datos' });
  }

  // Error genérico
  console.error('Error no manejado:', error);
  if (usingNext) {
    return next(boom.internal(defaultMessage));
  }
  return res.status(500).json({ message: defaultMessage });
};

/**
 * Wrapper para funciones async que maneja errores automáticamente
 * @param {Function} fn - Función async a envolver
 * @returns {Function} - Función envuelta que maneja errores
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      handleError(error, next);
    });
  };
};

/**
 * Valida que un registro existe, si no lanza error 404
 * @param {Object} record - El registro a validar
 * @param {string} message - Mensaje personalizado de error
 */
export const validateRecordExists = (record, message = 'Registro no encontrado') => {
  if (!record) {
    throw boom.notFound(message);
  }
  return record;
};

/**
 * Valida permisos de propietario o administrador
 * @param {Object} user - Usuario actual
 * @param {number} resourceOwnerId - ID del propietario del recurso
 * @param {string} message - Mensaje personalizado de error
 */
export const validateOwnership = (user, resourceOwnerId, message = 'No tienes permisos para acceder a este recurso') => {
  if (user.rol !== 'ADMINISTRADOR' && user.rol !== 'COORDINADOR' && user.id !== resourceOwnerId) {
    throw boom.forbidden(message);
  }
};