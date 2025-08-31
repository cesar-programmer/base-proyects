'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificaciones', {
      id_notificacion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario_destino: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      mensaje: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      tipo: {
        allowNull: false,
        type: Sequelize.ENUM('RECORDATORIO', 'APROBACION', 'DEVOLUCION', 'SISTEMA', 'FECHA_LIMITE')
      },
      leido: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      fecha_creacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      id_fecha_limite: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'fechas_limite',
          key: 'id_fecha_limite'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notificaciones');
  }
};