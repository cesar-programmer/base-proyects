import api from './api';

const userService = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      // Agregar timestamp para evitar caché
      const response = await api.get(`/users?_ts=${Date.now()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  },

  // Obtener usuarios por rol
  getUsersByRole: async (roleId) => {
    try {
      const response = await api.get(`/users?rolId=${roleId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios por rol');
    }
  },

  // Cambiar estado de usuario (activar/desactivar)
  toggleUserStatus: async (id) => {
    try {
      const response = await api.patch(`/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar estado del usuario');
    }
  },

  // Obtener roles disponibles
  getRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener roles');
    }
  }
};

export default userService;