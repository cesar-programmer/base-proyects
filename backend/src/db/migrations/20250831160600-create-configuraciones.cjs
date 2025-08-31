'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configuraciones', {
      clave: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(100)
      },
      valor: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      fecha_modificacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('configuraciones');
  }
};