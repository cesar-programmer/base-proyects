import api from './api';

const ENDPOINT = '/periodos-academicos';

export const periodoAcademicoService = {
  // Obtener todos los períodos académicos
  async getPeriodosAcademicos() {
    try {
      const response = await api.get(ENDPOINT);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener períodos académicos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener períodos académicos'
      };
    }
  },

  // Obtener período académico por ID
  async getPeriodoAcademico(id) {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener período académico:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener período académico'
      };
    }
  },

  // Obtener período académico activo
  async getPeriodoActivo() {
    try {
      const response = await api.get(`${ENDPOINT}/activo`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener período activo:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'No hay período académico activo'
      };
    }
  },

  // Crear nuevo período académico
  async createPeriodoAcademico(periodoData) {
    try {
      const response = await api.post(ENDPOINT, periodoData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al crear período académico:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear período académico'
      };
    }
  },

  // Actualizar período académico
  async updatePeriodoAcademico(id, periodoData) {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, periodoData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar período académico:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar período académico'
      };
    }
  },

  // Eliminar período académico
  async deletePeriodoAcademico(id) {
    try {
      const response = await api.delete(`${ENDPOINT}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar período académico:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar período académico'
      };
    }
  },

  // Activar período académico
  async activarPeriodoAcademico(id) {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, { activo: true });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al activar período académico:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al activar período académico'
      };
    }
  }
};

export default periodoAcademicoService;