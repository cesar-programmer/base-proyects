import api from './api';

class AuthService {
  // Login de usuario
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user } = response.data;
      
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  // Logout de usuario
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Obtener el usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtener el token actual
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Verificar si el usuario es administrador
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.rol?.nombre === 'ADMINISTRADOR';
  }

  // Verificar si el usuario es docente
  isDocente() {
    const user = this.getCurrentUser();
    return user?.rol?.nombre === 'DOCENTE';
  }

  // Verificar si el usuario es coordinador
  isCoordinador() {
    const user = this.getCurrentUser();
    return user?.rol?.nombre === 'COORDINADOR';
  }

  // Verificar si el usuario puede acceder como docente (incluye coordinadores temporalmente)
  canAccessAsDocente() {
    const user = this.getCurrentUser();
    return user?.rol?.nombre === 'DOCENTE' || user?.rol?.nombre === 'COORDINADOR';
  }
}

export default new AuthService();