import { Router } from 'express';
import {
  getActividades,
  getActividadById,
  getActividadesByUsuario,
  getActividadesByReporte,
  createActividad,
  updateActividad,
  deleteActividad,
  aprobarActividad,
  rechazarActividad,
  actualizarEstadoActividad
} from '../controllers/actividad.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateActividad } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para actividades
router.get('/', getActividades);
router.get('/usuario/:id_usuario', getActividadesByUsuario);
router.get('/reporte/:id_reporte', getActividadesByReporte);
router.get('/:id', getActividadById);
router.post('/', validateActividad, createActividad);
router.put('/:id', validateActividad, updateActividad);
router.patch('/:id/aprobar', aprobarActividad);
router.patch('/:id/rechazar', rechazarActividad);
router.patch('/:id/estado', actualizarEstadoActividad);
router.delete('/:id', deleteActividad);

export default router;