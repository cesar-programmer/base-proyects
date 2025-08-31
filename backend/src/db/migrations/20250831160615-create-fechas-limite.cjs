'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fechas_limite', {
      id_fecha_limite: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      fecha_limite: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      categoria: {
        allowNull: false,
        type: Sequelize.ENUM('REGISTRO', 'ENTREGA', 'REVISION', 'EVALUACION')
      },
      id_periodo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'PeriodosAcademicos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      semestre: {
        allowNull: true,
        type: Sequelize.STRING(10)
      },
      dias_recordatorio: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 7
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
      },
      fecha_modificacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fechas_limite');
  }
};