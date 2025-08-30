// Configuración global para tests
import { sequelize } from '../src/db/models/index.js';

// Configurar base de datos de testing
beforeAll(async () => {
  // Sincronizar modelos (solo para testing)
  await sequelize.sync({ force: true });
});

// Limpiar después de cada test
afterEach(async () => {
  // Limpiar todas las tablas
  const models = Object.keys(sequelize.models);
  for (const model of models) {
    await sequelize.models[model].destroy({ where: {}, force: true });
  }
});

// Cerrar conexión después de todos los tests
afterAll(async () => {
  await sequelize.close();
});