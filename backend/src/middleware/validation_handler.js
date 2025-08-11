import Boom from '@hapi/boom';
// aqui se crea un middleware de forma dinamica para validar el body
// utilizando closures y currying para pasarle los parametros que necesitamos al middleware
function validatorHandle(schema, property) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req[property], { abortEarly: false });
      next();
    } catch (error) {
      next(Boom.badRequest(error));
    }
  };
}
export { validatorHandle };
