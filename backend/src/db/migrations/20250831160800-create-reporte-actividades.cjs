'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReporteActividades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reporteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reportes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      actividadId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Actividades',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Orden de la actividad dentro del reporte'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Observaciones específicas de la actividad en este reporte'
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

    // Crear índices únicos para evitar duplicados
    await queryInterface.addIndex('ReporteActividades', ['reporteId', 'actividadId'], {
      unique: true,
      name: 'unique_reporte_actividad'
    });

    // Índices para mejorar performance
    await queryInterface.addIndex('ReporteActividades', ['reporteId']);
    await queryInterface.addIndex('ReporteActividades', ['actividadId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReporteActividades');
  }
};