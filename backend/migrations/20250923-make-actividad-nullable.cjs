'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hacer que id_actividad sea nullable para permitir archivos que solo pertenezcan a reportes
    await queryInterface.changeColumn('archivos', 'id_actividad', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'actividades',
        key: 'id_actividad'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir: hacer que id_actividad sea NOT NULL
    // Nota: Esto podría fallar si hay registros con id_actividad NULL
    await queryInterface.changeColumn('archivos', 'id_actividad', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'actividades',
        key: 'id_actividad'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};