import { Router } from 'express';
import {
  getArchivos,
  getArchivoById,
  getArchivosByActividad,
  uploadArchivo,
  downloadArchivo,
  deleteArchivo,
  getArchivoInfo
} from '../controllers/archivo.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para archivos
router.get('/', getArchivos);
router.get('/actividad/:id_actividad', getArchivosByActividad);
router.get('/:id', getArchivoById);
router.get('/:id/info', getArchivoInfo);
router.get('/:id/download', downloadArchivo);
// Log de diagnóstico para rastrear el 404 en subida de archivos
router.post('/upload', (req, res, next) => {
  console.log('📨 [Archivos] POST /archivos/upload recibido', {
    method: req.method,
    url: req.originalUrl,
    hasToken: !!req.headers.authorization,
    contentType: req.headers['content-type']
  });
  next();
}, upload.single('archivo'), uploadArchivo);
router.delete('/:id', deleteArchivo);

export default router;