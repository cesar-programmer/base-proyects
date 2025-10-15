'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener IDs de usuarios y actividades
    const usuarios = await queryInterface.sequelize.query(
      'SELECT id FROM Usuarios ORDER BY id ASC',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const actividades = await queryInterface.sequelize.query(
      'SELECT id FROM Actividades ORDER BY id ASC',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const u = (i) => usuarios?.[i]?.id ?? usuarios?.[0]?.id ?? null;
    const a = (i) => actividades?.[i]?.id ?? null;

    await queryInterface.bulkInsert('Reportes', [
      {
        titulo: 'Reporte de Actividades de Agosto',
        descripcion: 'Resumen de actividades realizadas durante agosto 2024',
        fechaRealizacion: '2024-08-31',
        participantesReales: 12,
        resultados: 'Se completaron 4 actividades clave con alta participación',
        observaciones: 'Buena recepción en la comunidad universitaria',
        recomendaciones: 'Mantener el ritmo de ejecución y seguimiento',
        estado: 'enviado',
        evidencias: JSON.stringify(['reporte_actividades_agosto_2024.pdf']),
        fechaEnvio: '2024-09-01',
        resumenEjecutivo: 'Las actividades de agosto cumplieron los objetivos y generaron impacto positivo.',
        actividadId: a(0),
        usuarioId: u(0),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Seguimiento de Tutorías de Tesis - Octubre',
        descripcion: 'Informe mensual del progreso de las tutorías de tesis de grado',
        fechaRealizacion: '2024-10-31',
        participantesReales: 5,
        resultados: '3 estudiantes completaron el marco teórico, 2 en fase de metodología',
        observaciones: 'Un estudiante presenta retraso significativo en su cronograma',
        recomendaciones: 'Intensificar el acompañamiento al estudiante con retraso',
        estado: 'revisado',
        evidencias: JSON.stringify(['cronogramas_estudiantes.xlsx', 'avances_tesis.zip']),
        fechaEnvio: '2024-11-01',
        resumenEjecutivo: 'El proceso de tutorías muestra avance general positivo; se requiere atención especial en un caso.',
        actividadId: a(2),
        usuarioId: u(2),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Reporte de Capacitación en Nuevas Tecnologías',
        descripcion: 'Informe de participación en curso de actualización tecnológica',
        fechaRealizacion: '2024-12-20',
        participantesReales: 1,
        resultados: 'Curso completado con certificación en tecnologías emergentes',
        observaciones: 'El contenido del curso superó las expectativas iniciales',
        recomendaciones: 'Compartir conocimientos adquiridos con el equipo docente',
        estado: 'borrador',
        evidencias: JSON.stringify(['certificado_curso.pdf', 'notas_aprendizaje.docx']),
        resumenEjecutivo: 'Actualización profesional valiosa que beneficiará la práctica docente.',
        actividadId: a(Math.min(4, (actividades.length || 1) - 1)),
        usuarioId: u(1),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reportes', null, {});
  }
};