import { Router } from 'express';
import {
  getConfiguraciones,
  getConfiguracionByClave,
  getValorConfiguracion,
  createConfiguracion,
  updateConfiguracion,
  updateValorConfiguracion,
  deleteConfiguracion,
  getConfiguracionesSistema,
  updateMultiplesConfiguraciones,
  resetConfiguracionesDefault
} from '../controllers/configuracion.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateConfiguracion } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para configuraciones
router.get('/', getConfiguraciones);
router.get('/sistema', getConfiguracionesSistema);
router.get('/:clave', getConfiguracionByClave);
router.get('/:clave/valor', getValorConfiguracion);
router.post('/', validateConfiguracion, createConfiguracion);
router.post('/multiples', updateMultiplesConfiguraciones);
router.post('/reset-default', resetConfiguracionesDefault);
router.put('/:clave', validateConfiguracion, updateConfiguracion);
router.patch('/:clave/valor', updateValorConfiguracion);
router.delete('/:clave', deleteConfiguracion);

export default router;