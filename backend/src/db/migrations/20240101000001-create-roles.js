'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id_rol: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      activo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      fecha_creacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Crear índices
    await queryInterface.addIndex('roles', ['nombre']);
    await queryInterface.addIndex('roles', ['activo']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};