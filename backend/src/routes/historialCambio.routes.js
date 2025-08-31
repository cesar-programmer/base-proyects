import { Router } from 'express';
import {
  getHistorialCambios,
  getHistorialCambioById,
  getHistorialByReporte,
  getHistorialByUsuario,
  createHistorialCambio,
  deleteHistorialCambio,
  deleteHistorialAntiguo,
  getEstadisticasHistorial
} from '../controllers/historialCambio.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateHistorialCambio } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para historial de cambios
router.get('/', getHistorialCambios);
router.get('/estadisticas', getEstadisticasHistorial);
router.get('/reporte/:id_reporte', getHistorialByReporte);
router.get('/usuario/:id_usuario', getHistorialByUsuario);
router.get('/:id', getHistorialCambioById);
router.post('/', validateHistorialCambio, createHistorialCambio);
router.delete('/:id', deleteHistorialCambio);
router.delete('/limpiar/antiguos', deleteHistorialAntiguo);

export default router;