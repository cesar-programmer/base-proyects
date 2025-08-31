import { upload, uploadSingle, uploadMultiple, deleteFile, moveFile, validateFileExists } from '../config/upload.js';

// Re-exportar todas las funciones de upload para mantener compatibilidad
export {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  moveFile,
  validateFileExists
};

// Exportar por defecto el middleware principal
export default upload;