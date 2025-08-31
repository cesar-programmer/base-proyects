'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener reportes existentes
    const reportes = await queryInterface.sequelize.query(
      'SELECT id FROM Reportes LIMIT 10',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Obtener usuarios existentes
    const usuarios = await queryInterface.sequelize.query(
      'SELECT id FROM Usuarios LIMIT 5',
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log('Reportes encontrados:', reportes.length);
    console.log('Usuarios encontrados:', usuarios.length);
    
    if (!reportes || reportes.length === 0 || !usuarios || usuarios.length === 0) {
      console.log('No hay reportes o usuarios disponibles para crear historial de cambios');
      return;
    }
    
    console.log('Primer reporte ID:', reportes[0]?.id);
    console.log('Primer usuario ID:', usuarios[0]?.id);

    const historialCambios = [
      {
        id_reporte: reportes[0].id,
        id_usuario_modificador: usuarios[0].id,
        descripcion_cambio: 'Reporte creado inicialmente',
        fecha_cambio: new Date('2024-09-01 10:00:00')
      },
      {
        id_reporte: reportes[0].id,
        id_usuario_modificador: usuarios[Math.min(1, usuarios.length - 1)].id,
        descripcion_cambio: 'Actualización de resultados obtenidos',
        fecha_cambio: new Date('2024-09-05 14:30:00')
      },
      {
        id_reporte: reportes[Math.min(1, reportes.length - 1)].id,
        id_usuario_modificador: usuarios[0].id,
        descripcion_cambio: 'Reporte enviado para revisión',
        fecha_cambio: new Date('2024-09-10 09:15:00')
      },
      {
        id_reporte: reportes[Math.min(1, reportes.length - 1)].id,
        id_usuario_modificador: usuarios[Math.min(2, usuarios.length - 1)].id,
        descripcion_cambio: 'Comentarios de revisión agregados',
        fecha_cambio: new Date('2024-09-12 16:45:00')
      },
      {
        id_reporte: reportes[Math.min(2, reportes.length - 1)].id,
        id_usuario_modificador: usuarios[Math.min(1, usuarios.length - 1)].id,
        descripcion_cambio: 'Corrección de observaciones solicitadas',
        fecha_cambio: new Date('2024-09-15 11:20:00')
      },
      {
        id_reporte: reportes[Math.min(2, reportes.length - 1)].id,
        id_usuario_modificador: usuarios[Math.min(2, usuarios.length - 1)].id,
        descripcion_cambio: 'Reporte aprobado',
        fecha_cambio: new Date('2024-09-18 13:00:00')
      },
      {
        id_reporte: reportes[Math.min(3, reportes.length - 1)].id,
        id_usuario_modificador: usuarios[0].id,
        descripcion_cambio: 'Actualización de evidencias adjuntas',
        fecha_cambio: new Date('2024-09-20 08:30:00')
      }
    ];

    await queryInterface.bulkInsert('historial_cambios', historialCambios, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('historial_cambios', null, {});
  }
};