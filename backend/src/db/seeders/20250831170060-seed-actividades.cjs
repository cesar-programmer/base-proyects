'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seeder vacío - Las actividades se crearán en producción según sea necesario
    console.log('Seeder de actividades: No se insertarán datos iniciales');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Actividades', null, {});
  }
};