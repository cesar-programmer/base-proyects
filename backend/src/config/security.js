import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import config from './config.js';

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.server.frontendUrl,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:8082'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Rate limiting para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    error: 'Demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
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