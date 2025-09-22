import { Router } from 'express';
import {
  getNotificaciones,
  getNotificacionById,
  getNotificacionesByUsuario,
  getNotificacionesNoLeidas,
  createNotificacion,
  marcarComoLeida,
  marcarTodasComoLeidas,
  deleteNotificacion,
  deleteNotificacionesAntiguas,
  getEstadisticasNotificaciones
} from '../controllers/notificacion.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateNotificacion } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para notificaciones
router.get('/', getNotificaciones);
router.get('/usuario/:usuarioId', getNotificacionesByUsuario);
router.get('/usuario/:usuarioId/no-leidas', getNotificacionesNoLeidas);
router.get('/usuario/:usuarioId/estadisticas', getEstadisticasNotificaciones);
router.get('/:id', getNotificacionById);
router.post('/', validateNotificacion, createNotificacion);
router.patch('/:id/leer', marcarComoLeida);
router.patch('/usuario/:usuarioId/leer-todas', marcarTodasComoLeidas);
router.delete('/:id', deleteNotificacion);
router.delete('/limpiar/antiguas', deleteNotificacionesAntiguas);

export default router;