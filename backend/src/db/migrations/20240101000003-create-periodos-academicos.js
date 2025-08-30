'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('periodos_academicos', {
      id_periodo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      fecha_inicio: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      fecha_fin: {
        allowNull: false,
        type: Sequelize.DATEONLY
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
    await queryInterface.addIndex('periodos_academicos', ['nombre']);
    await queryInterface.addIndex('periodos_academicos', ['activo']);
    await queryInterface.addIndex('periodos_academicos', ['fecha_inicio']);
    await queryInterface.addIndex('periodos_academicos', ['fecha_fin']);
    
    // Constraint para asegurar que fecha_fin > fecha_inicio
    await queryInterface.addConstraint('periodos_academicos', {
      fields: ['fecha_inicio', 'fecha_fin'],
      type: 'check',
      name: 'check_fechas_periodo',
      where: {
        fecha_fin: {
          [Sequelize.Op.gt]: Sequelize.col('fecha_inicio')
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('periodos_academicos');
  }
};