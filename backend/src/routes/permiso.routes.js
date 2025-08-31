import { Router } from 'express';
import {
  getPermisos,
  getPermisoById,
  createPermiso,
  updatePermiso,
  deletePermiso
} from '../controllers/permiso.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validatePermiso } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para permisos
router.get('/', getPermisos);
router.get('/:id', getPermisoById);
router.post('/', validatePermiso, createPermiso);
router.put('/:id', validatePermiso, updatePermiso);
router.delete('/:id', deletePermiso);

export default router;