'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero, eliminar la foreign key existente
    await queryInterface.removeConstraint('Reportes', 'Reportes_ibfk_1');
    
    // Modificar la columna actividadId para permitir valores nulos
    await queryInterface.changeColumn('Reportes', 'actividadId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    
    // Agregar la foreign key con SET NULL
    await queryInterface.addConstraint('Reportes', {
      fields: ['actividadId'],
      type: 'foreign key',
      name: 'Reportes_ibfk_1',
      references: {
        table: 'Actividades',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio: hacer actividadId NOT NULL nuevamente
    // Primero, eliminar la foreign key actual
    await queryInterface.removeConstraint('Reportes', 'Reportes_ibfk_1');
    
    // Actualizar cualquier valor NULL a un valor por defecto
    await queryInterface.sequelize.query(`
      UPDATE \`Reportes\` 
      SET actividadId = 1 
      WHERE actividadId IS NULL;
    `);
    
    // Cambiar la columna para no permitir NULL
    await queryInterface.changeColumn('Reportes', 'actividadId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    
    // Agregar la foreign key original
    await queryInterface.addConstraint('Reportes', {
      fields: ['actividadId'],
      type: 'foreign key',
      name: 'Reportes_ibfk_1',
      references: {
        table: 'Actividades',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};