import express from 'express';
import RecordatorioController from '../controllers/recordatorio.controller.js';
import { validatorHandler } from '../middleware/validation_handler.js';
import { verifyToken, checkAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();
const recordatorioController = new RecordatorioController();

// Middleware de autenticación para todas las rutas
router.use(verifyToken);
router.use(checkAdmin);

// Rutas de configuración
router.get('/configuracion', 
  recordatorioController.getConfiguracion.bind(recordatorioController)
);

router.put('/configuracion',
  recordatorioController.updateConfiguracion.bind(recordatorioController)
);



// Rutas de destinatarios
router.get('/destinatarios',
  recordatorioController.getDestinatarios.bind(recordatorioController)
);

// Rutas de envío
router.post('/enviar-manual',
  recordatorioController.enviarManual.bind(recordatorioController)
);

// Rutas de control
router.patch('/toggle',
  recordatorioController.toggle.bind(recordatorioController)
);

// Rutas de estadísticas
router.get('/estadisticas',
  recordatorioController.getEstadisticas.bind(recordatorioController)
);

export default router;