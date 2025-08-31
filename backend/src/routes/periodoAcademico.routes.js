import { Router } from 'express';
import {
  getPeriodosAcademicos,
  getPeriodoAcademicoById,
  getPeriodoActivo,
  createPeriodoAcademico,
  updatePeriodoAcademico,
  deletePeriodoAcademico
} from '../controllers/periodoAcademico.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validatePeriodoAcademico, validateUpdatePeriodoAcademico } from '../middleware/validation.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para periodos académicos
router.get('/', getPeriodosAcademicos);
router.get('/activo', getPeriodoActivo);
router.get('/:id', getPeriodoAcademicoById);
router.post('/', validatePeriodoAcademico, createPeriodoAcademico);
router.put('/:id', validateUpdatePeriodoAcademico, updatePeriodoAcademico);
router.delete('/:id', deletePeriodoAcademico);

export default router;