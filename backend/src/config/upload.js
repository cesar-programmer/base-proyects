import multer from 'multer';
import path from 'path';
import fs from 'fs';
import boom from '@hapi/boom';

// Crear directorios si no existen
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/reportes',
    'uploads/actividades',
    'uploads/evidencias',
    'uploads/temp'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Inicializar directorios
createUploadDirs();

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/temp';

    // Determinar carpeta en función del cuerpo y asociaciones
    const body = req.body || {};
    const category = (body.category || body.categoria || '').toLowerCase();

    // Preferir asociaciones explícitas
    if (body.id_actividad) {
      uploadPath = 'uploads/actividades';
    } else if (body.reporteId) {
      uploadPath = 'uploads/reportes';
    } else if (category === 'evidencia') {
      uploadPath = 'uploads/evidencias';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Tipos de archivo permitidos
  const allowedTypes = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'text/plain': '.txt'
  };
  
  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(boom.badRequest('Tipo de archivo no permitido'), false);
  }
};

// Configuración principal de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
    files: 5 // máximo 5 archivos por request
  }
});

// Middleware para archivos únicos
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(boom.badRequest('El archivo es demasiado grande (máximo 10MB)'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(boom.badRequest('Campo de archivo inesperado'));
        }
        return next(boom.badRequest(`Error de upload: ${err.message}`));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware para múltiples archivos
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(boom.badRequest('Uno o más archivos son demasiado grandes (máximo 10MB)'));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(boom.badRequest(`Máximo ${maxCount} archivos permitidos`));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(boom.badRequest('Campo de archivo inesperado'));
        }
        return next(boom.badRequest(`Error de upload: ${err.message}`));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Función para eliminar archivo
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Función para mover archivo
const moveFile = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Validar que el archivo existe
const validateFileExists = (filePath) => {
  return fs.existsSync(filePath);
};

export {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  moveFile,
  validateFileExists,
  createUploadDirs
};