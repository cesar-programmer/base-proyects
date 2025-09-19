'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Actualizar registros existentes que tengan 'rechazada' a 'devuelta'
    await queryInterface.sequelize.query(`
      UPDATE \`Actividades\` 
      SET estado_realizado = 'devuelta' 
      WHERE estado_realizado = 'rechazada';
    `);
    
    // Modificar la columna para actualizar el enum
    await queryInterface.changeColumn('Actividades', 'estado_realizado', {
      type: Sequelize.ENUM('pendiente', 'aprobada', 'devuelta'),
      allowNull: true,
      defaultValue: 'pendiente'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir los cambios
    await queryInterface.sequelize.query(`
      UPDATE \`Actividades\` 
      SET estado_realizado = 'rechazada' 
      WHERE estado_realizado = 'devuelta';
    `);
    
    // Revertir la columna al enum original
    await queryInterface.changeColumn('Actividades', 'estado_realizado', {
      type: Sequelize.ENUM('pendiente', 'aprobada', 'rechazada'),
      allowNull: true,
      defaultValue: 'pendiente'
    });
  }
};