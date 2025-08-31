'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener actividades y usuarios existentes
    const actividades = await queryInterface.sequelize.query(
      'SELECT id FROM Actividades ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const usuarios = await queryInterface.sequelize.query(
      'SELECT id FROM Usuarios ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (actividades.length === 0 || usuarios.length === 0) {
      console.log('No hay actividades o usuarios disponibles para crear reportes');
      return;
    }

    await queryInterface.bulkInsert('Reportes', [
      {
        titulo: 'Reporte de Clases de Matemáticas Avanzadas - Primer Parcial',
        descripcion: 'Informe del desarrollo de las clases de matemáticas avanzadas durante el primer parcial del semestre',
        fechaRealizacion: '2024-10-15',
        participantesReales: 28,
        resultados: 'Se completó el 85% del contenido programado. Los estudiantes mostraron buen rendimiento en cálculo diferencial.',
        observaciones: 'Algunos estudiantes requieren refuerzo en conceptos básicos de límites',
        recomendaciones: 'Implementar sesiones de tutoría adicionales para estudiantes con dificultades',
        estado: 'enviado',
        evidencias: JSON.stringify(['examenes_parciales.pdf', 'lista_asistencia.xlsx']),
        fechaEnvio: '2024-10-16',
        actividadId: actividades[0].id,
        usuarioId: usuarios[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Avance del Proyecto de Investigación en IA - Fase 1',
        descripcion: 'Reporte de progreso de la primera fase del proyecto de investigación en inteligencia artificial',
        fechaRealizacion: '2024-11-30',
        participantesReales: 3,
        resultados: 'Se completó la revisión bibliográfica y se definió la arquitectura del modelo de NLP',
        observaciones: 'El acceso a datasets especializados ha sido limitado',
        recomendaciones: 'Gestionar acceso a bases de datos académicas adicionales',
        estado: 'aprobado',
        evidencias: JSON.stringify(['revision_bibliografica.pdf', 'arquitectura_modelo.docx']),
        fechaEnvio: '2024-12-01',
        fechaRevision: '2024-12-05',
        comentariosRevision: 'Excelente progreso en la fase inicial. Continuar según lo planificado.',
        actividadId: actividades[1].id,
        usuarioId: usuarios[1].id,
        revisadoPorId: usuarios[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Seguimiento de Tutorías de Tesis - Octubre',
        descripcion: 'Informe mensual del progreso de las tutorías de tesis de grado',
        fechaRealizacion: '2024-10-31',
        participantesReales: 5,
        resultados: '3 estudiantes completaron el marco teórico, 2 están en fase de metodología',
        observaciones: 'Un estudiante presenta retraso significativo en su cronograma',
        recomendaciones: 'Intensificar el acompañamiento al estudiante con retraso',
        estado: 'revisado',
        evidencias: JSON.stringify(['cronogramas_estudiantes.xlsx', 'avances_tesis.zip']),
        fechaEnvio: '2024-11-01',
        actividadId: actividades[2].id,
        usuarioId: usuarios[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Reporte de Capacitación en Nuevas Tecnologías',
        descripcion: 'Informe de participación en el curso de actualización tecnológica',
        fechaRealizacion: '2024-12-20',
        participantesReales: 1,
        resultados: 'Completado exitosamente el curso con certificación en tecnologías emergentes',
        observaciones: 'El contenido del curso superó las expectativas iniciales',
        recomendaciones: 'Compartir conocimientos adquiridos con el equipo docente',
        estado: 'borrador',
        evidencias: JSON.stringify(['certificado_curso.pdf', 'notas_aprendizaje.docx']),
        actividadId: actividades[4].id,
        usuarioId: usuarios[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reportes', null, {});
  }
};