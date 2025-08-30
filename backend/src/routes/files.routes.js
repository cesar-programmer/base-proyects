const express = require('express');
const path = require('path');
const fs = require('fs');
const boom = require('@hapi/boom');
const { verifyToken, checkAdmin, checkDocenteOrAdmin } = require('../middleware/auth.middleware');
const { uploadSingle, uploadMultiple, deleteFile, validateFileExists } = require('../config/upload');
const validatorHandler = require('../middleware/validator.handler');
const { uploadFileSchema, deleteFileSchema } = require('../schemas/file.schema');

const router = express.Router();

// Subir archivo único
router.post('/upload',
  verifyToken,
  uploadSingle('file'),
  validatorHandler(uploadFileSchema, 'body'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw boom.badRequest('No se ha proporcionado ningún archivo');
      }

      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/api/v1/files/download/${req.file.filename}`
      };

      res.status(201).json({
        message: 'Archivo subido exitosamente',
        file: fileInfo
      });
    } catch (error) {
      next(error);
    }
  }
);

// Subir múltiples archivos
router.post('/upload-multiple',
  verifyToken,
  uploadMultiple('files', 5),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        throw boom.badRequest('No se han proporcionado archivos');
      }

      const filesInfo = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/api/v1/files/download/${file.filename}`
      }));

      res.status(201).json({
        message: `${req.files.length} archivos subidos exitosamente`,
        files: filesInfo
      });
    } catch (error) {
      next(error);
    }
  }
);

// Descargar archivo
router.get('/download/:filename',
  verifyToken,
  async (req, res, next) => {
    try {
      const { filename } = req.params;
      
      // Buscar archivo en todas las carpetas de upload
      const uploadDirs = ['uploads/reportes', 'uploads/actividades', 'uploads/evidencias', 'uploads/temp'];
      let filePath = null;
      
      for (const dir of uploadDirs) {
        const testPath = path.join(dir, filename);
        if (validateFileExists(testPath)) {
          filePath = testPath;
          break;
        }
      }
      
      if (!filePath) {
        throw boom.notFound('Archivo no encontrado');
      }

      // Obtener información del archivo
      const stats = fs.statSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      
      // Configurar headers apropiados
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (['.doc', '.docx'].includes(ext)) contentType = 'application/msword';
      else if (['.xls', '.xlsx'].includes(ext)) contentType = 'application/vnd.ms-excel';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Enviar archivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      next(error);
    }
  }
);

// Ver archivo (para imágenes y PDFs)
router.get('/view/:filename',
  verifyToken,
  async (req, res, next) => {
    try {
      const { filename } = req.params;
      
      // Buscar archivo en todas las carpetas de upload
      const uploadDirs = ['uploads/reportes', 'uploads/actividades', 'uploads/evidencias', 'uploads/temp'];
      let filePath = null;
      
      for (const dir of uploadDirs) {
        const testPath = path.join(dir, filename);
        if (validateFileExists(testPath)) {
          filePath = testPath;
          break;
        }
      }
      
      if (!filePath) {
        throw boom.notFound('Archivo no encontrado');
      }

      const ext = path.extname(filename).toLowerCase();
      
      // Solo permitir visualización de ciertos tipos de archivo
      const viewableTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'];
      if (!viewableTypes.includes(ext)) {
        throw boom.badRequest('Tipo de archivo no visualizable');
      }
      
      // Configurar headers apropiados
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline');
      
      // Enviar archivo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar archivo (solo admin)
router.delete('/:filename',
  verifyToken,
  checkAdmin,
  validatorHandler(deleteFileSchema, 'params'),
  async (req, res, next) => {
    try {
      const { filename } = req.params;
      
      // Buscar archivo en todas las carpetas de upload
      const uploadDirs = ['uploads/reportes', 'uploads/actividades', 'uploads/evidencias', 'uploads/temp'];
      let filePath = null;
      
      for (const dir of uploadDirs) {
        const testPath = path.join(dir, filename);
        if (validateFileExists(testPath)) {
          filePath = testPath;
          break;
        }
      }
      
      if (!filePath) {
        throw boom.notFound('Archivo no encontrado');
      }

      // Eliminar archivo
      await deleteFile(filePath);
      
      res.json({
        message: 'Archivo eliminado exitosamente',
        filename
      });
      
    } catch (error) {
      next(error);
    }
  }
);

// Listar archivos (solo admin)
router.get('/',
  verifyToken,
  checkAdmin,
  async (req, res, next) => {
    try {
      const { type = 'all', page = 1, limit = 20 } = req.query;
      
      let uploadDirs = ['uploads/reportes', 'uploads/actividades', 'uploads/evidencias', 'uploads/temp'];
      
      if (type !== 'all') {
        uploadDirs = [`uploads/${type}`];
      }
      
      const files = [];
      
      for (const dir of uploadDirs) {
        if (fs.existsSync(dir)) {
          const dirFiles = fs.readdirSync(dir);
          
          for (const file of dirFiles) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            files.push({
              filename: file,
              path: filePath,
              size: stats.size,
              created: stats.birthtime,
              modified: stats.mtime,
              type: dir.split('/')[1],
              url: `/api/v1/files/download/${file}`
            });
          }
        }
      }
      
      // Ordenar por fecha de creación (más recientes primero)
      files.sort((a, b) => new Date(b.created) - new Date(a.created));
      
      // Paginación
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedFiles = files.slice(startIndex, endIndex);
      
      res.json({
        files: paginatedFiles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: files.length,
          pages: Math.ceil(files.length / limit)
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;