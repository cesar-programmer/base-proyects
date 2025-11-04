'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seeder vacío - Los períodos académicos se crearán en producción según sea necesario
    console.log('Seeder de períodos académicos: No se insertarán datos iniciales');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PeriodosAcademicos', null, {});
  }
};