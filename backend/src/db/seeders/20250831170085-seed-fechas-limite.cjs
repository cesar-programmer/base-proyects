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
      // Fechas del primer semestre 2025 (Enero - Junio)
      {
        nombre: 'Entrega de Plan de Trabajo Semestral',
        descripcion: 'Fecha límite para la entrega del plan de trabajo académico del primer semestre',
        fecha_limite: '2025-02-15',
        categoria: 'ENTREGA',
        id_periodo: periodos[0].id,
        semestre: '2025-1',
        dias_recordatorio: 7,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Reporte de Gestión Académica - Comités',
        descripcion: 'Fecha límite para reportes de participación en comités y gestión académica del primer trimestre',
        fecha_limite: '2025-03-30',
        categoria: 'REVISION',
        id_periodo: periodos[0].id,
        semestre: '2025-1',
        dias_recordatorio: 14,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Entrega de Reportes de Investigación - Fase 1',
        descripcion: 'Fecha límite para la entrega de reportes de avance de proyectos de investigación',
        fecha_limite: '2025-04-15',
        categoria: 'ENTREGA',
        id_periodo: periodos[0].id,
        semestre: '2025-1',
        dias_recordatorio: 10,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Evaluación de Tutorías - Primer Semestre',
        descripcion: 'Fecha límite para la evaluación y reporte de actividades de tutoría del primer semestre',
        fecha_limite: '2025-05-20',
        categoria: 'EVALUACION',
        id_periodo: periodos[0].id,
        semestre: '2025-1',
        dias_recordatorio: 5,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Entrega de Reportes de Docencia - Primer Semestre',
        descripcion: 'Fecha límite para la entrega de reportes de actividades de docencia del primer semestre',
        fecha_limite: '2025-06-30',
        categoria: 'ENTREGA',
        id_periodo: periodos[0].id,
        semestre: '2025-1',
        dias_recordatorio: 7,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      // Fechas del segundo semestre 2025 (Julio - Diciembre)
      {
        nombre: 'Entrega de Plan de Trabajo - Segundo Semestre',
        descripcion: 'Fecha límite para la entrega del plan de trabajo académico del segundo semestre',
        fecha_limite: '2025-08-15',
        categoria: 'ENTREGA',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: '2025-2',
        dias_recordatorio: 7,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Certificación de Capacitaciones',
        descripcion: 'Fecha límite para presentar certificaciones de capacitaciones y cursos realizados',
        fecha_limite: '2025-09-30',
        categoria: 'REGISTRO',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: '2025-2',
        dias_recordatorio: 15,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Entrega de Reportes de Investigación - Fase 2',
        descripcion: 'Fecha límite para la entrega de reportes finales de proyectos de investigación',
        fecha_limite: '2025-11-15',
        categoria: 'ENTREGA',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: '2025-2',
        dias_recordatorio: 21,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Evaluación de Tutorías - Segundo Semestre',
        descripcion: 'Fecha límite para la evaluación y reporte de actividades de tutoría del segundo semestre',
        fecha_limite: '2025-11-30',
        categoria: 'EVALUACION',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: '2025-2',
        dias_recordatorio: 5,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      },
      {
        nombre: 'Reporte Anual de Actividades',
        descripcion: 'Fecha límite para la entrega del reporte anual consolidado de todas las actividades académicas',
        fecha_limite: '2025-12-15',
        categoria: 'ENTREGA',
        id_periodo: periodos.length > 1 ? periodos[1].id : periodos[0].id,
        semestre: '2025-2',
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