'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Actualizar registros existentes que tengan 'rechazado' a 'devuelto'
    await queryInterface.sequelize.query(`
      UPDATE \`Reportes\` 
      SET estado = 'devuelto' 
      WHERE estado = 'rechazado';
    `);
    
    // Modificar la columna para actualizar el enum
    await queryInterface.changeColumn('Reportes', 'estado', {
      type: Sequelize.ENUM('borrador', 'enviado', 'revisado', 'aprobado', 'devuelto'),
      allowNull: false,
      defaultValue: 'borrador'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir los cambios
    await queryInterface.sequelize.query(`
      UPDATE \`Reportes\` 
      SET estado = 'rechazado' 
      WHERE estado = 'devuelto';
    `);
    
    // Revertir la columna al enum original
    await queryInterface.changeColumn('Reportes', 'estado', {
      type: Sequelize.ENUM('borrador', 'enviado', 'revisado', 'aprobado', 'rechazado'),
      allowNull: false,
      defaultValue: 'borrador'
    });
  }
};