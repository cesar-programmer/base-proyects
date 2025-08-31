'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('catalogo_actividades', [
      {
        titulo: 'Clases Magistrales',
        descripcion: 'Impartir clases magistrales en asignaturas asignadas',
        categoria: 'DOCENCIA',
        horas_estimadas: 4,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Preparación de Material Didáctico',
        descripcion: 'Elaboración y actualización de material didáctico para clases',
        categoria: 'DOCENCIA',
        horas_estimadas: 2,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Evaluación de Estudiantes',
        descripcion: 'Diseño, aplicación y calificación de evaluaciones',
        categoria: 'DOCENCIA',
        horas_estimadas: 3,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Tutoría Académica',
        descripcion: 'Asesoría y acompañamiento académico a estudiantes',
        categoria: 'TUTORIAS',
        horas_estimadas: 2,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Investigación Científica',
        descripcion: 'Desarrollo de proyectos de investigación',
        categoria: 'INVESTIGACION',
        horas_estimadas: 6,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Publicación de Artículos',
        descripcion: 'Redacción y publicación de artículos científicos',
        categoria: 'INVESTIGACION',
        horas_estimadas: 8,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Comités Académicos',
        descripcion: 'Participación en comités y consejos académicos',
        categoria: 'GESTION_ACADEMICA',
        horas_estimadas: 3,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Proyectos de Extensión',
        descripcion: 'Desarrollo de proyectos de extensión universitaria',
        categoria: 'EXTENSION',
        horas_estimadas: 4,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Capacitación Docente',
        descripcion: 'Participación en cursos y talleres de capacitación',
        categoria: 'CAPACITACION',
        horas_estimadas: 8,
        activo: true,
        fecha_creacion: new Date()
      },
      {
        titulo: 'Dirección de Tesis',
        descripcion: 'Dirección y asesoría de trabajos de grado',
        categoria: 'TUTORIAS',
        horas_estimadas: 5,
        activo: true,
        fecha_creacion: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('catalogo_actividades', null, {});
  }
};