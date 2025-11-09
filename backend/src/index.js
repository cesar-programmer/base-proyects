import express from 'express';
import dotenv from 'dotenv';
import './config/logging.js';
import { validateEnv } from './config/validateEnv.js';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import routerApi from './routes/index.js';
import { logErrors, errorHandler, boomErrorHandler, queryErrorHandler } from './middleware/error.handler.js';
import { corsOptions, generalSecurityMiddleware, securityHeaders } from './config/security.js';
import { initReminderScheduler } from './scheduler/recordatorio.scheduler.js';

// Configurar variables de entorno
dotenv.config();
validateEnv();

const app = express();

// IMPORTANTE: CORS debe ir PRIMERO, antes de cualquier otro middleware
app.use(cors(corsOptions));

// Middlewares de seguridad
app.use(generalSecurityMiddleware);
app.use(securityHeaders);

// Middlewares básicos
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🎓 Sistema de Reportes Académicos - API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1'
    }
  });
});

// Configurar rutas de la API
routerApi(app);

// Middleware de manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Middleware global de manejo de errores
app.use(logErrors);
app.use(queryErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 3001;

// Solo iniciar servidor si no estamos en modo test
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });

  // Inicializar scheduler de recordatorios
  initReminderScheduler().catch(err => {
    console.error('❌ Error inicializando el scheduler de recordatorios:', err);
  });

  // Manejo graceful de cierre
  process.on('SIGTERM', () => {
    console.log('📴 Cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    });
  });
}

export default app;
