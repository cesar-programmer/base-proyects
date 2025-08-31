'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('configuraciones', [
      {
        clave: 'sistema.nombre',
        valor: 'Sistema de Gestión de Reportes Universitarios',
        descripcion: 'Nombre oficial del sistema',
        fecha_modificacion: new Date()
      },
      {
        clave: 'sistema.version',
        valor: '1.0.0',
        descripcion: 'Versión actual del sistema',
        fecha_modificacion: new Date()
      },
      {
        clave: 'reportes.max_archivos',
        valor: '10',
        descripcion: 'Número máximo de archivos por reporte',
        fecha_modificacion: new Date()
      },
      {
        clave: 'reportes.tamaño_max_archivo',
        valor: '50',
        descripcion: 'Tamaño máximo de archivo en MB',
        fecha_modificacion: new Date()
      },
      {
        clave: 'notificaciones.email_habilitado',
        valor: 'true',
        descripcion: 'Habilitar notificaciones por email',
        fecha_modificacion: new Date()
      },
      {
        clave: 'notificaciones.dias_recordatorio',
        valor: '3',
        descripcion: 'Días antes de fecha límite para enviar recordatorio',
        fecha_modificacion: new Date()
      },
      {
        clave: 'sistema.mantenimiento',
        valor: 'false',
        descripcion: 'Modo de mantenimiento del sistema',
        fecha_modificacion: new Date()
      },
      {
        clave: 'actividades.presupuesto_max',
        valor: '10000000',
        descripcion: 'Presupuesto máximo por actividad en pesos',
        fecha_modificacion: new Date()
      },
      {
        clave: 'sistema.timezone',
        valor: 'America/Bogota',
        descripcion: 'Zona horaria del sistema',
        fecha_modificacion: new Date()
      },
      {
        clave: 'backup.frecuencia_dias',
        valor: '7',
        descripcion: 'Frecuencia de respaldo automático en días',
        fecha_modificacion: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('configuraciones', null, {});
  }
};