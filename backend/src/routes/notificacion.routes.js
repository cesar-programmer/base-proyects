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
router.get('/usuario/:id_usuario', getNotificacionesByUsuario);
router.get('/usuario/:id_usuario/no-leidas', getNotificacionesNoLeidas);
router.get('/usuario/:id_usuario/estadisticas', getEstadisticasNotificaciones);
router.get('/:id', getNotificacionById);
router.post('/', validateNotificacion, createNotificacion);
router.patch('/:id/leer', marcarComoLeida);
router.patch('/usuario/:id_usuario/leer-todas', marcarTodasComoLeidas);
router.delete('/:id', deleteNotificacion);
router.delete('/limpiar/antiguas', deleteNotificacionesAntiguas);

export default router;