import { Router } from 'express';
import {
  getFechasLimite,
  getFechaLimiteById,
  getFechasLimiteProximas,
  createFechaLimite,
  updateFechaLimite,
  deleteFechaLimite,
  toggleFechaLimite
} from '../controllers/fechaLimite.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateFechaLimite } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para fechas límite
router.get('/', getFechasLimite);
router.get('/proximas', getFechasLimiteProximas);
router.get('/:id', getFechaLimiteById);
router.post('/', validateFechaLimite, createFechaLimite);
router.put('/:id', validateFechaLimite, updateFechaLimite);
router.patch('/:id/toggle', toggleFechaLimite);
router.delete('/:id', deleteFechaLimite);

export default router;