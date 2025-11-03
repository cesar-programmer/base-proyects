// Silenciar logs verbosos en producción sin alterar warn/error
// Mantiene comportamiento en desarrollo y test.
const env = process.env.NODE_ENV;

if (env === 'production') {
  const noop = () => {};
  const methods = [
    'log',
    'debug',
    'trace',
    'time',
    'timeEnd',
    'group',
    'groupCollapsed',
    'groupEnd',
    'table'
  ];
  for (const m of methods) {
    try {
      if (typeof console[m] === 'function') console[m] = noop;
    } catch (_) {
      // ignorar si no se puede reasignar
    }
  }
}

