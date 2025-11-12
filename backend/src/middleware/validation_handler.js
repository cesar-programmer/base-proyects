import Boom from '@hapi/boom';
// aqui se crea un middleware de forma dinamica para validar el body
// utilizando closures y currying para pasarle los parametros que necesitamos al middleware
function validatorHandle(schema, property) {
  return async (req, res, next) => {
    try {
      const options = {
        abortEarly: false,
        // Permitir parámetros desconocidos en queries (e.g. _ts para cache-busting)
        allowUnknown: property === 'query',
        // Removerlos para que no pasen al controller
        stripUnknown: property === 'query'
      };

      const value = await schema.validateAsync(req[property], options);
      // Si se sanitizó la query, reemplazarla con el valor validado
      if (property === 'query') {
        req[property] = value;
      }
      next();
    } catch (error) {
      console.error('❌ Error de validación Joi:', {
        property,
        details: error.details?.map(d => ({
          message: d.message,
          path: d.path,
          type: d.type
        })),
        value: req[property]
      });
      next(Boom.badRequest(error));
    }
  };
}
export { validatorHandle as validatorHandler };
