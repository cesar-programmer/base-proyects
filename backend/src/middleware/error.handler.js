import { Sequelize } from 'sequelize';

const isProd = process.env.NODE_ENV === 'production';

function logErrors(err, req, res, next) {
  if (!isProd) {
    console.log('logErrors');
    console.log(err);
  }
  next(err);
}

function errorHandler(err, req, res, next) {
  if (!isProd) console.log('errorHandler');
  const payload = {
    message: 'internal server error'
  };
  if (!isProd) payload.stack = err.stack;
  res.status(500).json(payload);
}

function boomErrorHandler(err, req, res, next) {
  if (!isProd) console.log('boomErrorHandler');
  if (err.isBoom) {
    const { statusCode, payload } = err.output;
    res.status(statusCode).json(payload);
  } else {
    next(err);
  }
}

function queryErrorHandler(err, req, res, next) {
  if (!isProd) console.log('queryErrorHandler');
  if (err instanceof Sequelize.ValidationError) {
    const errors = err.errors.map((error) => error.message);
    res.status(400).json(errors);
  } else {
    next(err);
  }
}

export { logErrors, errorHandler, boomErrorHandler, queryErrorHandler };
