import express from 'express';

// Importar todas las rutas disponibles
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import roleRoutes from './role.routes.js';
import reporteRoutes from './reporte.routes.js';
import filesRoutes from './files.routes.js';
import permisoRoutes from './permiso.routes.js';
import periodoAcademicoRoutes from './periodoAcademico.routes.js';
import actividadRoutes from './actividad.routes.js';
import catalogoActividadRoutes from './catalogoActividad.routes.js';
import fechaLimiteRoutes from './fechaLimite.routes.js';
import archivoRoutes from './archivo.routes.js';
import notificacionRoutes from './notificacion.routes.js';
import historialCambioRoutes from './historialCambio.routes.js';
import configuracionRoutes from './configuracion.routes.js';
import estadisticaRoutes from './estadistica.routes.js';
import recordatorioRoutes from './recordatorio.router.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Desactivar caché para todas las respuestas de la API
  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });

  // Configurar todas las rutas disponibles
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/roles', roleRoutes);
  router.use('/reportes', reporteRoutes);
  router.use('/files', filesRoutes);
  router.use('/permisos', permisoRoutes);
  router.use('/periodos-academicos', periodoAcademicoRoutes);
  router.use('/actividades', actividadRoutes);
  router.use('/catalogo-actividades', catalogoActividadRoutes);
  router.use('/fechas-limite', fechaLimiteRoutes);
  router.use('/archivos', archivoRoutes);
  router.use('/notificaciones', notificacionRoutes);
  router.use('/historial-cambios', historialCambioRoutes);
  router.use('/configuraciones', configuracionRoutes);
  router.use('/estadisticas', estadisticaRoutes);
  router.use('/recordatorios', recordatorioRoutes);

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
        fechasLimite: '/api/v1/fechas-limite',
        catalogoActividades: '/api/v1/catalogo-actividades',
        periodosAcademicos: '/api/v1/periodos-academicos',
        permisos: '/api/v1/permisos',
        archivos: '/api/v1/archivos',
        files: '/api/v1/files',
        historialCambios: '/api/v1/historial-cambios',
        configuraciones: '/api/v1/configuraciones'
      },
      documentation: 'Consultar documentación de la API para más detalles'
    });
  });
}

export default routerApi;