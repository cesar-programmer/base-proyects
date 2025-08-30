'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre_completo: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true
      },
      password_hash: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      id_rol: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id_rol'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
      },
      ultimo_login: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    // Crear índices
    await queryInterface.addIndex('usuarios', ['email']);
    await queryInterface.addIndex('usuarios', ['id_rol']);
    await queryInterface.addIndex('usuarios', ['activo']);
    await queryInterface.addIndex('usuarios', ['nombre_completo']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};