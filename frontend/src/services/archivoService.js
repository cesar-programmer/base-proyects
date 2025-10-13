import api from './api';

const archivoService = {
  // Descargar archivo de reporte por ID
  downloadArchivo: async (archivoId) => {
    try {
      console.log('🔍 [archivoService] Iniciando descarga de archivo con ID:', archivoId);
      
      const response = await api.get(`/archivos/${archivoId}/download`, {
        responseType: 'blob',
      });
      
      console.log('📥 [archivoService] Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        dataType: typeof response.data,
        dataSize: response.data?.size || 'unknown',
        contentType: response.headers['content-type']
      });
      
      // Verificar si el blob es válido
      if (!response.data || response.data.size === 0) {
        console.error('❌ [archivoService] Blob vacío o inválido recibido');
        throw new Error('Archivo vacío recibido del servidor');
      }
      
      console.log('✅ [archivoService] Descarga exitosa, retornando blob');
      return response.data;
    } catch (error) {
      console.error('❌ [archivoService] Error al descargar archivo:', {
        archivoId,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Error al descargar archivo');
    }
  },

  // Ver archivo de reporte por ID
  viewArchivo: async (archivoId) => {
    try {
      const response = await api.get(`/archivos/${archivoId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al visualizar archivo');
    }
  },

  // Obtener información de un archivo
  getArchivoInfo: async (archivoId) => {
    try {
      const response = await api.get(`/archivos/${archivoId}/info`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener información del archivo');
    }
  },

  // Obtener archivos por actividad
  getArchivosByActividad: async (actividadId) => {
    try {
      const response = await api.get(`/archivos/actividad/${actividadId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener archivos de la actividad');
    }
  },

  // Subir archivo para actividad o reporte (con opciones)
  uploadArchivo: async (file, actividadId, descripcion = '', categoria = 'evidencia', options = {}) => {
    try {
      const formData = new FormData();
      formData.append('archivo', file);
      // Enviar id_actividad solo si es un valor válido
      if (actividadId !== undefined && actividadId !== null && actividadId !== '') {
        formData.append('id_actividad', actividadId);
      }
      formData.append('descripcion', descripcion);
      // Alinear nombre del campo con el backend
      formData.append('categoria', categoria);
      if (options?.reporteId) {
        formData.append('reporteId', options.reporteId);
      }

      const response = await api.post('/archivos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options.onUploadProgress,
        signal: options.signal
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir archivo');
    }
  },

  // Eliminar archivo
  deleteArchivo: async (archivoId) => {
    try {
      const response = await api.delete(`/archivos/${archivoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar archivo');
    }
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

export default archivoService;