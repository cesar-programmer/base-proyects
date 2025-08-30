import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

// Configuración para MySQL (no PostgreSQL)
const DB_USER = encodeURIComponent(process.env.DB_USER || 'user');
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD || 'password');
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || 'reportesdb';

// Crear conexión a MySQL
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql', // Cambiar de postgres a mysql
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export { sequelize };
