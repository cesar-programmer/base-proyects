'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener periodos académicos existentes
    const periodos = await queryInterface.sequelize.query(
      'SELECT id FROM PeriodosAcademicos ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (periodos.length === 0) {
      console.log('No hay períodos académicos disponibles para crear fechas límite');
      return;
    }

    await queryInterface.bulkInsert('fechas_limite', [
      {
        nombre: 'Entrega de Reportes de Docencia - Primer Parcial',
        descripcion: 'Fecha límite para la entrega de reportes de actividades de docencia del primer parcial',
        fecha_limite: '2024-10-20',
        categoria: 'ENTREGA',
        id_periodo: periodos[0].id,
        semestre: 1,
        dias_recordatorio: 7,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Entrega de Reportes de Investigación - Fase 1',
        descripcion: 'Fecha límite para la entrega de reportes de proyectos de investigación en su primera fase',
        fecha_limite: '2024-12-15',
        categoria: 'ENTREGA',
        id_periodo: periodos[0].id,
        semestre: 1,
        dias_recordatorio: 10,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Evaluación de Tutorías - Primer Semestre',
        descripcion: 'Fecha límite para la evaluación y reporte de actividades de tutoría',
        fecha_limite: '2024-12-20',
        categoria: 'EVALUACION',
        id_periodo: periodos[0].id,
        semestre: 1,
        dias_recordatorio: 5,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Reporte de Gestión Académica - Comités',
        descripcion: 'Fecha límite para reportes de participación en comités y gestión académica',
        fecha_limite: '2024-12-01',
        categoria: 'REVISION',
        id_periodo: periodos[0].id,
        semestre: 1,
        dias_recordatorio: 14,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Certificación de Capacitaciones',
        descripcion: 'Fecha límite para presentar certificaciones de capacitaciones realizadas',
        fecha_limite: '2024-12-31',
        categoria: 'REGISTRO',
        id_periodo: periodos[0].id,
        semestre: 1,
        dias_recordatorio: 15,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Entrega de Reportes de Docencia - Segundo Parcial',
        descripcion: 'Fecha límite para la entrega de reportes de actividades de docencia del segundo parcial',
        fecha_limite: '2025-03-20',
        categoria: 'ENTREGA',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: 2,
        dias_recordatorio: 7,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Evaluación Final de Proyectos de Investigación',
        descripcion: 'Fecha límite para la evaluación final de proyectos de investigación',
        fecha_limite: '2025-05-30',
        categoria: 'ENTREGA',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: 2,
        dias_recordatorio: 21,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Reporte Anual de Actividades',
        descripcion: 'Fecha límite para la entrega del reporte anual consolidado de todas las actividades',
        fecha_limite: '2025-06-15',
        categoria: 'ENTREGA',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: 2,
        dias_recordatorio: 30,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('fechas_limite', null, {});
  }
};