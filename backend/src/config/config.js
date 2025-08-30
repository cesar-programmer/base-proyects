import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8082'
  },

  // Configuración de la base de datos
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'reportesdb',
    dialect: 'mysql'
  },

  // Configuración JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt_secret_default',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

export default config;
