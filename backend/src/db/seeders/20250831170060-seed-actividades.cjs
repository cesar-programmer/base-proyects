'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener usuarios y períodos académicos existentes
    const usuarios = await queryInterface.sequelize.query(
      "SELECT id FROM Usuarios ORDER BY id LIMIT 3",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const periodos = await queryInterface.sequelize.query(
      "SELECT id FROM PeriodosAcademicos ORDER BY id LIMIT 2",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (usuarios.length === 0 || periodos.length === 0) {
      console.log('No hay usuarios o períodos académicos para crear actividades');
      return;
    }

    await queryInterface.bulkInsert('Actividades', [
      {
        titulo: 'Clases de Matemáticas Avanzadas',
        descripcion: 'Impartir clases de matemáticas avanzadas para estudiantes de ingeniería',
        categoria: 'DOCENCIA',
        fechaInicio: '2024-08-15',
        fechaFin: '2024-12-10',
        ubicacion: 'Aula 201 - Edificio de Ingeniería',
        objetivos: 'Enseñar conceptos avanzados de cálculo diferencial e integral',
        recursos: 'Proyector, pizarra, material didáctico',
        presupuesto: 0.00,
        participantesEsperados: 30,
        usuarioId: usuarios[0].id,
        periodoAcademicoId: periodos[0].id,
        estado_realizado: 'pendiente',
        comentarios_revision: null,
        fecha_revision: null,
        estado_planificacion: 'aprobada',
        periodo_planificacion: '2024-2',
        observaciones_planificacion: 'Actividad aprobada para el segundo semestre 2024',
        fecha_envio_planificacion: '2024-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Proyecto de Investigación en IA',
        descripcion: 'Desarrollo de algoritmos de inteligencia artificial para procesamiento de lenguaje natural',
        categoria: 'INVESTIGACION',
        fechaInicio: '2024-09-01',
        fechaFin: '2025-02-28',
        ubicacion: 'Laboratorio de Computación',
        objetivos: 'Desarrollar nuevos algoritmos de NLP',
        recursos: 'Servidores, datasets, software especializado',
        presupuesto: 15000.00,
        participantesEsperados: 3,
        usuarioId: usuarios[1].id,
        periodoAcademicoId: periodos[0].id,
        estado_realizado: 'pendiente',
        comentarios_revision: null,
        fecha_revision: null,
        estado_planificacion: 'aprobada',
        periodo_planificacion: '2024-2',
        observaciones_planificacion: 'Proyecto de investigación aprobado con presupuesto asignado',
        fecha_envio_planificacion: '2024-08-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Tutoría de Tesis de Grado',
        descripcion: 'Dirección y asesoría de estudiantes en sus trabajos de grado',
        categoria: 'TUTORIAS',
        fechaInicio: '2024-08-01',
        fechaFin: '2024-12-15',
        ubicacion: 'Oficina 305',
        objetivos: 'Guiar a estudiantes en la elaboración de sus tesis',
        recursos: 'Bibliografía especializada, acceso a bases de datos',
        presupuesto: 0.00,
        participantesEsperados: 5,
        usuarioId: usuarios[1].id,
        periodoAcademicoId: periodos[0].id,
        estado_realizado: 'aprobada',
        comentarios_revision: 'Excelente seguimiento a los estudiantes. Continuar con el cronograma establecido.',
        fecha_revision: '2024-10-15',
        estado_planificacion: 'aprobada',
        periodo_planificacion: '2024-2',
        observaciones_planificacion: 'Tutoría aprobada para 5 estudiantes',
        fecha_envio_planificacion: '2024-07-20',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Comité de Evaluación Curricular',
        descripcion: 'Participación en comité para revisión y actualización del currículo',
        categoria: 'GESTION_ACADEMICA',
        fechaInicio: '2024-10-01',
        fechaFin: '2024-11-30',
        ubicacion: 'Sala de Reuniones',
        objetivos: 'Revisar y actualizar el plan de estudios',
        recursos: 'Documentos curriculares, normativas académicas',
        presupuesto: 0.00,
        participantesEsperados: 8,
        usuarioId: usuarios[0].id,
        periodoAcademicoId: periodos[1].id,
        estado_realizado: 'pendiente',
        comentarios_revision: null,
        fecha_revision: null,
        estado_planificacion: 'enviada',
        periodo_planificacion: '2025-1',
        observaciones_planificacion: 'Pendiente de aprobación por el comité académico',
        fecha_envio_planificacion: '2024-09-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Curso de Capacitación en Nuevas Tecnologías',
        descripcion: 'Participación en curso de actualización tecnológica',
        categoria: 'CAPACITACION',
        fechaInicio: '2024-11-15',
        fechaFin: '2024-12-20',
        ubicacion: 'Plataforma Virtual',
        objetivos: 'Actualizar conocimientos en tecnologías emergentes',
        recursos: 'Acceso a plataforma, material digital',
        presupuesto: 2000.00,
        participantesEsperados: 1,
        usuarioId: usuarios[1].id,
        periodoAcademicoId: periodos[1].id,
        estado_realizado: 'pendiente',
        comentarios_revision: null,
        fecha_revision: null,
        estado_planificacion: 'borrador',
        periodo_planificacion: '2025-1',
        observaciones_planificacion: 'En proceso de definición de fechas y modalidad',
        fecha_envio_planificacion: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Actividades', null, {});
  }
};