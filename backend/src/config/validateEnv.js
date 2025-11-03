// Validaciones y advertencias de configuración en producción (no rompe la app)
const isProd = process.env.NODE_ENV === 'production';

function warnIfDefault(name, value, defaults = []) {
  if (!isProd) return;
  const v = value?.toString() ?? '';
  if (!v || defaults.includes(v)) {
    console.warn(`[config] Valor por defecto inseguro en producción para ${name}. Configúralo mediante variables de entorno.`);
  }
}

export function validateEnv() {
  // JWT
  warnIfDefault('JWT_SECRET', process.env.JWT_SECRET, ['jwt_secret_default']);

  // DB
  warnIfDefault('DB_PASSWORD', process.env.DB_PASSWORD, ['password', 'rootpassword', '']);

  // FRONTEND_URL
  warnIfDefault('FRONTEND_URL', process.env.FRONTEND_URL, ['http://localhost:8082', 'http://localhost:5173']);

  // API rate limits (recomendación)
  if (isProd && !process.env.GENERAL_RATE_LIMIT_MAX) {
    console.warn('[config] GENERAL_RATE_LIMIT_MAX no definido. Usando valor por defecto 300 en producción.');
  }
}

