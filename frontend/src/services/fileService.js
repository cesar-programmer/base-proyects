import api from './api';

const fileService = {
  // Subir archivo único
  uploadFile: async (file, description = '', category = 'evidencia') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('category', category);

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir archivo');
    }
  },

  // Subir múltiples archivos
  uploadMultipleFiles: async (files, description = '', category = 'evidencia') => {
    try {
      const formData = new FormData();
      
      // Agregar todos los archivos
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('description', description);
      formData.append('category', category);

      const response = await api.post('/files/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir archivos');
    }
  },

  // Descargar archivo
  downloadFile: async (filename) => {
    try {
      const response = await api.get(`/files/download/${filename}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al descargar archivo');
    }
  },

  // Ver archivo (para PDFs e imágenes)
  viewFile: async (filename) => {
    try {
      const response = await api.get(`/files/view/${filename}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al visualizar archivo');
    }
  },

  // Obtener URL para visualizar archivo
  getViewUrl: (filename) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    return `${baseUrl}/files/view/${filename}`;
  },

  // Obtener URL para descargar archivo
  getDownloadUrl: (filename) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    return `${baseUrl}/files/download/${filename}`;
  },

  // Eliminar archivo (solo admin)
  deleteFile: async (filename) => {
    try {
      const response = await api.delete(`/files/${filename}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar archivo');
    }
  },

  // Listar archivos (solo admin)
  listFiles: async (type = 'all', page = 1, limit = 20) => {
    try {
      const response = await api.get('/files', {
        params: { type, page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al listar archivos');
    }
  },

  // Validar tipo de archivo
  validateFileType: (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'text/plain'
    ];
    
    return allowedTypes.includes(file.type);
  },

  // Validar tamaño de archivo (máximo 10MB)
  validateFileSize: (file, maxSizeMB = 10) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  // Formatear tamaño de archivo
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

export default fileService;