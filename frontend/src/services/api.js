import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = (() => {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv) return fromEnv;
  if (!import.meta.env.DEV) {
    // En producción, advertir si falta VITE_API_URL y usar fallback controlado
    console.warn('[api] VITE_API_URL no definida; usando fallback http://localhost:3001/api/v1');
  }
  return 'http://localhost:3001/api/v1';
})();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Evitar caché sólo en desarrollo
    if (import.meta.env.DEV && (config.method || 'get').toLowerCase() === 'get') {
      // Bust de caché simple (dev únicamente)
      config.params = { ...(config.params || {}), _ts: Date.now() };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Solo redirigir si hay un token en localStorage (token expirado)
      // No redirigir en errores de login (cuando no hay token)
      const token = localStorage.getItem('authToken');
      if (token) {
        // Token expirado o inválido
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
