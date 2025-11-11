import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import config from './config.js';

const isProd = process.env.NODE_ENV === 'production';

// Configuración de CORS
const parseOrigins = (str) => (str || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);

    const envOrigins = parseOrigins(process.env.CORS_ORIGINS);
    const devOrigins = [
      config.server.frontendUrl,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8082'
    ];

    const allowedOrigins = envOrigins.length > 0
      ? envOrigins
      : (isProd ? [config.server.frontendUrl] : devOrigins);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 horas de cache para preflight
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Rate limiting para autenticación
const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 5 * 60 * 1000), // 5 min por defecto
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 10000), // 10,000 intentos por IP
  message: {
    error: 'Demasiados intentos de autenticación. Intenta de nuevo en 5 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: Number(process.env.GENERAL_RATE_LIMIT_WINDOW_MS || 5 * 60 * 1000), // 5 min por defecto
  max: Number(process.env.GENERAL_RATE_LIMIT_MAX || 10000), // 10,000 peticiones
  message: {
    error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Configuración de Helmet
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
};

// Middleware de seguridad para rutas de autenticación
const authSecurityMiddleware = [
  authLimiter,
  helmet(helmetOptions),
  cors(corsOptions)
];

// Middleware de seguridad general
const generalSecurityMiddleware = [
  generalLimiter,
  helmet(helmetOptions),
  cors(corsOptions)
];

// Headers de seguridad adicionales
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

export {
  corsOptions,
  authLimiter,
  generalLimiter,
  helmetOptions,
  authSecurityMiddleware,
  generalSecurityMiddleware,
  securityHeaders
};
