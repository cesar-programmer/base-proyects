'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columna horas_dedicadas a Actividades
    await queryInterface.addColumn('Actividades', 'horas_dedicadas', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Horas dedicadas reales por el docente a la actividad'
    });

    // Agregar columna total_horas a Reportes
    await queryInterface.addColumn('Reportes', 'total_horas', {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
      comment: 'Suma automática de horas dedicadas de las actividades asociadas'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir columnas agregadas
    await queryInterface.removeColumn('Actividades', 'horas_dedicadas');
    await queryInterface.removeColumn('Reportes', 'total_horas');
  }
};