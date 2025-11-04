'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seeder vacío - Las fechas límite se crearán en producción según sea necesario
    console.log('Seeder de fechas límite: No se insertarán datos iniciales');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('fechas_limite', null, {});
  }
};