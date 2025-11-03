// Silencia logs de desarrollo en producción sin afectar errores/advertencias
// No toca la lógica de la app; sólo controla verbosidad de consola.
// Se ejecuta por efectos secundarios al importarse en main.jsx

if (!import.meta.env.DEV) {
  const noop = () => {};
  const methodsToSilence = [
    'log',
    'debug',
    'trace',
    'table',
    'group',
    'groupCollapsed',
    'groupEnd',
    'time',
    'timeEnd'
  ];

  for (const m of methodsToSilence) {
    try {
      if (typeof console[m] === 'function') {
        // eslint-disable-next-line no-console
        console[m] = noop;
      }
    } catch (_err) {
      // Ignorar si el host no permite reasignar
    }
  }
}

