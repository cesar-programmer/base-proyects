'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'resetToken', {
      type: Sequelize.STRING(500),
      allowNull: true
    });

    await queryInterface.addColumn('Usuarios', 'resetCode', {
      type: Sequelize.STRING(10),
      allowNull: true
    });

    await queryInterface.addColumn('Usuarios', 'resetTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'resetToken');
    await queryInterface.removeColumn('Usuarios', 'resetCode');
    await queryInterface.removeColumn('Usuarios', 'resetTokenExpires');
  }
};
