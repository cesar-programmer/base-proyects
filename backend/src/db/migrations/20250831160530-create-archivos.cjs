'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('archivos', {
      id_archivo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_actividad: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Actividades',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre_original: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      nombre_almacenado: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true
      },
      ruta_almacenamiento: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      tipo_mime: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      tamano_bytes: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fecha_subida: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('archivos');
  }
};