'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Actividades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      fechaInicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fechaFin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('planificada', 'en_progreso', 'completada', 'cancelada'),
        allowNull: false,
        defaultValue: 'planificada'
      },
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      ubicacion: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      objetivos: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      recursos: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      presupuesto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      participantesEsperados: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      archivoAdjunto: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      periodoAcademicoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PeriodosAcademicos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Actividades');
  }
};
