import express from 'express';
import EstadisticaController from '../controllers/estadistica.controller.js';
import { verifyToken, checkAdmin, checkDocenteOrAdmin } from '../middleware/auth.middleware.js';
import { validatorHandler } from '../middleware/validation_handler.js';

const router = express.Router();
const estadisticaController = new EstadisticaController();

// Rutas para docentes y administradores
router.get('/general',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getGeneralStats.bind(estadisticaController)
);

router.get('/usuarios',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getUserStats.bind(estadisticaController)
);

router.get('/reportes',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getReportStats.bind(estadisticaController)
);

router.get('/actividades',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getActivityStats.bind(estadisticaController)
);

router.get('/fechas-limite',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getDeadlineStats.bind(estadisticaController)
);

router.get('/notificaciones',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getNotificationStats.bind(estadisticaController)
);

// ⭐ RUTA PRINCIPAL - Dashboard completo con todas las estadísticas
router.get('/dashboard',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getDashboardStats.bind(estadisticaController)
);

// Rutas con parámetros
router.get('/periodo/:periodId',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getPeriodStats.bind(estadisticaController)
);

router.get('/usuario/:userId',
  verifyToken,
  checkDocenteOrAdmin,
  estadisticaController.getUserSpecificStats.bind(estadisticaController)
);

export default router;