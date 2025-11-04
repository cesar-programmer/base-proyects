'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seeder vacío - El historial de cambios se generará automáticamente en producción
    console.log('Seeder de historial de cambios: No se insertarán datos iniciales');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('historial_cambios', null, {});
  }
};