// Configuración global para tests
import { sequelize } from '../src/db/models/index.js';

// Configurar base de datos de testing
beforeAll(async () => {
  try {
    // Verificar conexión
    await sequelize.authenticate();
    
    // No usar sync({ force: true }) ya que tenemos migraciones
    // Las tablas ya existen por las migraciones
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
});

// Limpiar después de cada test
afterEach(async () => {
  try {
    // Deshabilitar verificaciones de claves foráneas
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpiar tablas en orden específico para evitar problemas de FK
    const tablesToClean = [
      'historial_cambios',
      'Reportes', 
      'Actividades',
      'notificaciones',
      'Usuarios',
      'periodos_academicos',
      'Roles'
    ];
    
    for (const table of tablesToClean) {
      await sequelize.query(`DELETE FROM ${table}`);
    }
    
    // Rehabilitar verificaciones de claves foráneas
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.warn('Error cleaning database:', error.message);
  }
});

// Cerrar conexión después de todos los tests
afterAll(async () => {
  await sequelize.close();
});