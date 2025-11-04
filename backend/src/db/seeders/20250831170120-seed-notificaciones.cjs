'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seeder vacío - Las notificaciones se generarán automáticamente en producción
    console.log('Seeder de notificaciones: No se insertarán datos iniciales');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notificaciones', null, {});
  }
};