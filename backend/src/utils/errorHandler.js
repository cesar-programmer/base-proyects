import boom from '@hapi/boom';

/**
 * Maneja errores de forma consistente en los controladores
 * @param {Error} error - El error a manejar
 * @param {Function} next - Función next de Express
 */
export const handleError = (error, next) => {
  // Si ya es un error de Boom, pasarlo directamente
  if (boom.isBoom(error)) {
    return next(error);
  }

  // Errores de validación de Sequelize
  if (error.name === 'SequelizeValidationError') {
    const validationErrors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    return next(boom.badRequest('Errores de validación', { errors: validationErrors }));
  }

  // Errores de clave única de Sequelize
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0]?.path || 'campo';
    return next(boom.conflict(`El ${field} ya existe`));
  }

  // Errores de clave foránea de Sequelize
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return next(boom.badRequest('Referencia inválida a otro registro'));
  }

  // Errores de base de datos de Sequelize
  if (error.name === 'SequelizeDatabaseError') {
    return next(boom.internal('Error en la base de datos'));
  }

  // Error de conexión a la base de datos
  if (error.name === 'SequelizeConnectionError') {
    return next(boom.internal('Error de conexión a la base de datos'));
  }

  // Errores de timeout
  if (error.name === 'SequelizeTimeoutError') {
    return next(boom.internal('Timeout en la operación de base de datos'));
  }

  // Error genérico
  console.error('Error no manejado:', error);
  return next(boom.internal('Error interno del servidor'));
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
  if (user.rol !== 'ADMINISTRADOR' && user.id !== resourceOwnerId) {
    throw boom.forbidden(message);
  }
};