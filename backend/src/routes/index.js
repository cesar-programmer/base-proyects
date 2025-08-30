const express = require('express');

// Importar todas las rutas
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const reporteRoutes = require('./reporte.routes');
const actividadRoutes = require('./actividad.routes');
const notificacionRoutes = require('./notificacion.routes');
const estadisticaRoutes = require('./estadistica.routes');
const fechaLimiteRoutes = require('./fechaLimite.routes');
const catalogoActividadRoutes = require('./catalogoActividad.routes');
const periodoAcademicoRoutes = require('./periodoAcademico.routes');
const rolRoutes = require('./rol.routes');
const archivoRoutes = require('./archivo.routes');
const filesRoutes = require('./files.routes');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Configurar todas las rutas
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/reportes', reporteRoutes);
  router.use('/actividades', actividadRoutes);
  router.use('/notificaciones', notificacionRoutes);
  router.use('/estadisticas', estadisticaRoutes);
  router.use('/fechas-limite', fechaLimiteRoutes);
  router.use('/catalogo-actividades', catalogoActividadRoutes);
  router.use('/periodos-academicos', periodoAcademicoRoutes);
  router.use('/roles', rolRoutes);
  router.use('/archivos', archivoRoutes);
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

module.exports = routerApi;