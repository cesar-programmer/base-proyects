'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reportes', {
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
      fechaRealizacion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      participantesReales: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      resultados: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      recomendaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('borrador', 'enviado', 'revisado', 'aprobado', 'rechazado'),
        allowNull: false,
        defaultValue: 'borrador'
      },
      evidencias: {
        type: Sequelize.JSON,
        allowNull: true
      },
      fechaEnvio: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fechaRevision: {
        type: Sequelize.DATE,
        allowNull: true
      },
      comentariosRevision: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      actividadId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Actividades',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
      revisadoPorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('Reportes');
  }
};
