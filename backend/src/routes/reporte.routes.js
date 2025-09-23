import express from 'express';
import ReporteController from '../controllers/reporte.controller.js';
import { verifyToken, checkAdmin, checkDocenteOrAdmin } from '../middleware/auth.middleware.js';
import { validatorHandler } from '../middleware/validation_handler.js';
import { 
  createReporteSchema, 
  updateReporteSchema, 
  getReporteSchema,
  changeReporteStatusSchema,
  getReportesByDocenteSchema,
  getReportesByPeriodSchema,
  getReportHistorySchema
} from '../schemas/reporte.schema.js';

const router = express.Router();
const reporteController = new ReporteController();

// Rutas para usuarios autenticados
router.get('/my-reportes',
  verifyToken,
  reporteController.getMyReportes.bind(reporteController)
);

// Rutas para docentes y administradores
router.get('/',
  verifyToken,
  checkDocenteOrAdmin,
  reporteController.getReportes.bind(reporteController)
);

// Ruta para obtener historial de reportes (DEBE estar antes de /:id)
router.get('/historial',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReportHistorySchema, 'query'),
  reporteController.getReportHistory.bind(reporteController)
);

router.get('/:id',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.getReporte.bind(reporteController)
);

router.post('/',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(createReporteSchema, 'body'),
  reporteController.createReporte.bind(reporteController)
);

router.put('/:id',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReporteSchema, 'params'),
  validatorHandler(updateReporteSchema, 'body'),
  reporteController.updateReporte.bind(reporteController)
);

router.delete('/:id',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.deleteReporte.bind(reporteController)
);

// Nueva ruta para eliminar archivos de reportes
router.delete('/:id/archivos/:archivoId',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.removeArchivo.bind(reporteController)
);

router.get('/docente/:docenteId',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReportesByDocenteSchema, 'params'),
  reporteController.getReportesByDocente.bind(reporteController)
);

router.get('/period/:periodId',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReportesByPeriodSchema, 'params'),
  reporteController.getReportesByPeriod.bind(reporteController)
);

router.get('/stats/general',
  verifyToken,
  checkDocenteOrAdmin,
  reporteController.getReporteStats.bind(reporteController)
);

// Rutas solo para administradores
router.get('/pending/review',
  verifyToken,
  checkAdmin,
  reporteController.getReportesPendingReview.bind(reporteController)
);

router.patch('/:id/status',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  validatorHandler(changeReporteStatusSchema, 'body'),
  reporteController.changeReporteStatus.bind(reporteController)
);

export default router;