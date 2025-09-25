'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Reportes', 'resumenEjecutivo', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Resumen ejecutivo del reporte con puntos principales y conclusiones'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reportes', 'resumenEjecutivo');
  }
};