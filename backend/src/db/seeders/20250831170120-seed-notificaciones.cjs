'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener usuarios existentes
    const usuarios = await queryInterface.sequelize.query(
      'SELECT id FROM Usuarios LIMIT 10',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Obtener fechas límite existentes
    const fechasLimite = await queryInterface.sequelize.query(
      'SELECT id_fecha_limite FROM fechas_limite LIMIT 10',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!usuarios || usuarios.length === 0) {
      console.log('No hay usuarios disponibles para crear notificaciones');
      return;
    }

    const notificaciones = [
      {
        id_usuario_destino: usuarios[0].id,
        mensaje: 'Recordatorio: La fecha límite para entrega de reportes de docencia se acerca',
        tipo: 'FECHA_LIMITE',
        leido: false,
        fecha_creacion: new Date('2024-10-15 09:00:00'),
        id_fecha_limite: fechasLimite.length > 0 ? fechasLimite[0].id_fecha_limite : null
      },
      {
        id_usuario_destino: usuarios[Math.min(1, usuarios.length - 1)].id,
        mensaje: 'Su reporte ha sido aprobado exitosamente',
        tipo: 'SISTEMA',
        leido: true,
        fecha_creacion: new Date('2024-09-20 14:30:00'),
        id_fecha_limite: null
      },
      {
        id_usuario_destino: usuarios[0].id,
        mensaje: 'Su reporte requiere correcciones. Por favor revise los comentarios',
        tipo: 'DEVOLUCION',
        leido: false,
        fecha_creacion: new Date('2024-09-25 11:15:00'),
        id_fecha_limite: null
      },
      {
        id_usuario_destino: usuarios[Math.min(2, usuarios.length - 1)].id,
        mensaje: 'Nuevo período académico disponible para reportes',
        tipo: 'SISTEMA',
        leido: false,
        fecha_creacion: new Date('2024-08-01 08:00:00'),
        id_fecha_limite: null
      },
      {
        id_usuario_destino: usuarios[Math.min(1, usuarios.length - 1)].id,
        mensaje: 'Recordatorio: Faltan 3 días para la fecha límite de entrega',
        tipo: 'FECHA_LIMITE',
        leido: false,
        fecha_creacion: new Date('2024-10-17 10:00:00'),
        id_fecha_limite: fechasLimite.length > 1 ? fechasLimite[1].id_fecha_limite : fechasLimite[0]?.id_fecha_limite
      },
      {
        id_usuario_destino: usuarios[Math.min(3, usuarios.length - 1)].id,
        mensaje: 'Su reporte ha sido rechazado. Consulte los comentarios del revisor',
        tipo: 'DEVOLUCION',
        leido: true,
        fecha_creacion: new Date('2024-09-30 16:45:00'),
        id_fecha_limite: null
      },
      {
        id_usuario_destino: usuarios[0].id,
        mensaje: 'Recordatorio: Evaluación de tutorías pendiente',
        tipo: 'FECHA_LIMITE',
        leido: false,
        fecha_creacion: new Date('2024-12-15 09:30:00'),
        id_fecha_limite: fechasLimite.length > 2 ? fechasLimite[2].id_fecha_limite : fechasLimite[0]?.id_fecha_limite
      },
      {
        id_usuario_destino: usuarios[Math.min(2, usuarios.length - 1)].id,
        mensaje: 'Nueva configuración del sistema aplicada',
        tipo: 'SISTEMA',
        leido: true,
        fecha_creacion: new Date('2024-08-15 12:00:00'),
        id_fecha_limite: null
      },
      {
        id_usuario_destino: usuarios[Math.min(4, usuarios.length - 1)].id,
        mensaje: 'Recordatorio: Certificación de capacitaciones vence pronto',
        tipo: 'FECHA_LIMITE',
        leido: false,
        fecha_creacion: new Date('2024-12-25 08:00:00'),
        id_fecha_limite: fechasLimite.length > 3 ? fechasLimite[3].id_fecha_limite : fechasLimite[0]?.id_fecha_limite
      },
      {
        id_usuario_destino: usuarios[Math.min(1, usuarios.length - 1)].id,
        mensaje: 'Su reporte anual ha sido procesado correctamente',
        tipo: 'SISTEMA',
        leido: false,
        fecha_creacion: new Date('2024-06-20 15:20:00'),
        id_fecha_limite: null
      }
    ];

    await queryInterface.bulkInsert('notificaciones', notificaciones, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notificaciones', null, {});
  }
};