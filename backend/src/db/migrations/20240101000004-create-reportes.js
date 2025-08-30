'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportes', {
      id_reporte: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_docente: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_periodo: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'periodos_academicos',
          key: 'id_periodo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      tipo: {
        allowNull: false,
        type: Sequelize.ENUM('ACTIVIDADES_PLANIFICADAS', 'ACTIVIDADES_REALIZADAS')
      },
      estado: {
        allowNull: false,
        type: Sequelize.ENUM('BORRADOR', 'ENVIADO', 'EN_REVISION', 'APROBADO', 'DEVUELTO'),
        defaultValue: 'BORRADOR'
      },
      fecha_creacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      fecha_envio: {
        allowNull: true,
        type: Sequelize.DATE
      },
      fecha_ultima_modificacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      observaciones_admin: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      semestre: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });

    // Crear índices
    await queryInterface.addIndex('reportes', ['id_docente']);
    await queryInterface.addIndex('reportes', ['id_periodo']);
    await queryInterface.addIndex('reportes', ['tipo']);
    await queryInterface.addIndex('reportes', ['estado']);
    await queryInterface.addIndex('reportes', ['fecha_creacion']);
    await queryInterface.addIndex('reportes', ['semestre']);
    
    // Índice compuesto para búsquedas comunes
    await queryInterface.addIndex('reportes', ['id_docente', 'id_periodo', 'tipo']);
    await queryInterface.addIndex('reportes', ['estado', 'fecha_envio']);
    
    // Constraint para asegurar que semestre sea 1 o 2
    await queryInterface.addConstraint('reportes', {
      fields: ['semestre'],
      type: 'check',
      name: 'check_semestre_valido',
      where: {
        semestre: {
          [Sequelize.Op.in]: [1, 2]
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reportes');
  }
};