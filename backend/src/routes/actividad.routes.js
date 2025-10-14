import { Router } from 'express';
import {
  getActividades,
  getActividadById,
  getActividadesByUsuario,
  getActividadesByReporte,
  createActividad,
  createActividadPlanificada,
  updateActividad,
  deleteActividad,
  aprobarActividad,
  rechazarActividad,
  actualizarEstadoActividad,
  getEstadisticasActividades,
  getActividadesPendientesDashboard,
  getActividadesDevueltas,
  enviarPlanificacion,
  getActividadesAgrupadasPorPeriodo,
  getMisActividadesPeriodoActivo
} from '../controllers/actividad.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateActividad, validateActividadPlanificada, validateUpdateActividad } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para actividades
router.get('/', getActividades);
router.get('/estadisticas', getEstadisticasActividades);
router.get('/pendientes-dashboard', getActividadesPendientesDashboard);
router.get('/devueltas', getActividadesDevueltas);
router.get('/usuario/:usuarioId', getActividadesByUsuario);
router.get('/usuario/:usuarioId/agrupadas', getActividadesAgrupadasPorPeriodo);
router.get('/reporte/:id_reporte', getActividadesByReporte);
router.get('/:id', getActividadById);
router.get('/mis/periodo-activo', getMisActividadesPeriodoActivo);
router.post('/', validateActividad, createActividad);
router.post('/planificada', validateActividadPlanificada, createActividadPlanificada);
router.post('/enviar-planificacion', enviarPlanificacion);
router.put('/:id', validateUpdateActividad, updateActividad);
router.patch('/:id/aprobar', aprobarActividad);
router.patch('/:id/rechazar', rechazarActividad);
router.patch('/:id/estado', actualizarEstadoActividad);
router.delete('/:id', deleteActividad);

export default router;