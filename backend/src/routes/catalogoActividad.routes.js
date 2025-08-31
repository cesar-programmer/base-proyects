import { Router } from 'express';
import {
  getCatalogoActividades,
  getCatalogoActividadById,
  getActividadesByCategoria,
  createCatalogoActividad,
  updateCatalogoActividad,
  deleteCatalogoActividad,
  toggleCatalogoActividad
} from '../controllers/catalogoActividad.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validateCatalogoActividad } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para catálogo de actividades
router.get('/', getCatalogoActividades);
router.get('/categoria/:categoria', getActividadesByCategoria);
router.get('/:id', getCatalogoActividadById);
router.post('/', validateCatalogoActividad, createCatalogoActividad);
router.put('/:id', validateCatalogoActividad, updateCatalogoActividad);
router.patch('/:id/toggle', toggleCatalogoActividad);
router.delete('/:id', deleteCatalogoActividad);

export default router;