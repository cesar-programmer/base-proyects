'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('catalogo_actividades', {
      id_catalogo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      categoria: {
        allowNull: false,
        type: Sequelize.ENUM('DOCENCIA', 'INVESTIGACION', 'TUTORIAS', 'GESTION_ACADEMICA', 'EXTENSION', 'CAPACITACION')
      },
      horas_estimadas: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      activo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      fecha_creacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('catalogo_actividades');
  }
};