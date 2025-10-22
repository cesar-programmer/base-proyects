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
  getReportHistorySchema,
  getReportesQuerySchema,
  archiveReporteSchema
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
  validatorHandler(getReportesQuerySchema, 'query'),
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

// Ruta para generar PDF del reporte
router.get('/:id/pdf',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.generateReportePDF.bind(reporteController)
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

// Ruta para obtener reportes pendientes para el dashboard
router.get('/pending/dashboard',
  verifyToken,
  checkDocenteOrAdmin,
  reporteController.getPendingForDashboard.bind(reporteController)
);

// Ruta para obtener información de fecha límite y semestre
router.get('/deadline/info',
  verifyToken,
  reporteController.getDeadlineInfo.bind(reporteController)
);

// Rutas solo para administradores

// Endpoint para que docentes envíen sus reportes (cambiar de Pendiente a En revisión)
router.patch('/:id/enviar',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.enviarReporte.bind(reporteController)
);

router.patch('/:id/status',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  validatorHandler(changeReporteStatusSchema, 'body'),
  reporteController.changeReporteStatus.bind(reporteController)
);

// Rutas para aprobación y rechazo de reportes
router.patch('/:id/aprobar',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.approveReporte.bind(reporteController)
);

router.patch('/:id/aprobar-rapido',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.quickApproveReporte.bind(reporteController)
);

router.patch('/:id/rechazar',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.rejectReporte.bind(reporteController)
);

router.patch('/:id/devolver-pendiente',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.returnReporteToPending.bind(reporteController)
);

router.patch('/:id/devolver-revision',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.returnReporteToReview.bind(reporteController)
);

router.patch('/:id/estado',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  reporteController.updateReporteStatus.bind(reporteController)
);

router.patch('/:id/archivar',
  verifyToken,
  checkAdmin,
  validatorHandler(getReporteSchema, 'params'),
  validatorHandler(archiveReporteSchema, 'body'),
  reporteController.archiveReporte.bind(reporteController)
);

export default router;