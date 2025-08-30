import express from 'express';

// Importar todas las rutas disponibles
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import reporteRoutes from './reporte.routes.js';
import filesRoutes from './files.routes.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Configurar todas las rutas disponibles
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/reportes', reporteRoutes);
  router.use('/files', filesRoutes);

  // Ruta de prueba para verificar que la API está funcionando
  router.get('/health', (req, res) => {
    res.json({
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Ruta para obtener información general de la API
  router.get('/', (req, res) => {
    res.json({
      message: 'Sistema de Gestión de Reportes Académicos - API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        reportes: '/api/v1/reportes',
        actividades: '/api/v1/actividades',
        notificaciones: '/api/v1/notificaciones',
        estadisticas: '/api/v1/estadisticas',
        fechasLimite: '/api/v1/fechas-limite',
        catalogoActividades: '/api/v1/catalogo-actividades',
        periodosAcademicos: '/api/v1/periodos-academicos',
        roles: '/api/v1/roles',
        archivos: '/api/v1/archivos',
        files: '/api/v1/files'
      },
      documentation: 'Consultar documentación de la API para más detalles'
    });
  });
}

export default routerApi;