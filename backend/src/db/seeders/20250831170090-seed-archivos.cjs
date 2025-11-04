'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seeder vacío - Los archivos se crearán en producción según sea necesario
    console.log('Seeder de archivos: No se insertarán datos iniciales');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('archivos', null, {});
  }
};