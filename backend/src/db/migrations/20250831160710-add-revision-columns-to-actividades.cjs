'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar las columnas de revisión a la tabla Actividades
    await queryInterface.addColumn('Actividades', 'estado_realizado', {
      type: Sequelize.ENUM('pendiente', 'aprobada', 'devuelta'),
      allowNull: true,
      defaultValue: 'pendiente',
      comment: 'Estado de revisión de la actividad'
    });

    await queryInterface.addColumn('Actividades', 'comentarios_revision', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Comentarios de la revisión de la actividad'
    });

    await queryInterface.addColumn('Actividades', 'fecha_revision', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Fecha en que se realizó la revisión'
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar las columnas de revisión
    await queryInterface.removeColumn('Actividades', 'fecha_revision');
    await queryInterface.removeColumn('Actividades', 'comentarios_revision');
    await queryInterface.removeColumn('Actividades', 'estado_realizado');
  }
};