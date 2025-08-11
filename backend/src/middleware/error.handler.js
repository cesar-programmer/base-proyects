import { Sequelize } from 'sequelize';

function logErrors(err, req, res, next) {
  console.log('logErrors');
  console.log(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  console.log('errorHandler');
  res.status(500).json({
    message: 'internal server error',
    stack: err.stack
  });
}

function boomErrorHandler(err, req, res, next) {
  console.log('boomErrorHandler');
  if (err.isBoom) {
    const { statusCode, payload } = err.output;
    res.status(statusCode).json(payload);
  } else {
    next(err);
  }
}

function queryErrorHandler(err, req, res, next) {
  console.log('queryErrorHandler');
  if (err instanceof Sequelize.ValidationError) {
    const errors = err.errors.map((error) => error.message);
    res.status(400).json(errors);
  } else {
    next(err);
  }
}

export { logErrors, errorHandler, boomErrorHandler, queryErrorHandler };
