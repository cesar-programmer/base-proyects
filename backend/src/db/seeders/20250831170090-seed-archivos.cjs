'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('archivos', [
      {
        id_archivo: 1,
        nombre_original: 'reporte_actividades_agosto_2024.pdf',
        nombre_almacenado: 'archivo_1_20240831_reporte_actividades.pdf',
        ruta_almacenamiento: '/uploads/reportes/archivo_1_20240831_reporte_actividades.pdf',
        tipo_mime: 'application/pdf',
        tamano_bytes: 2048576, // 2MB
        id_actividad: 1, // Conferencia de Investigación en IA
        fecha_subida: '2024-08-31'
      },
      {
        id_archivo: 2,
        nombre_original: 'evidencias_conferencia_ia.jpg',
        nombre_almacenado: 'archivo_2_20240915_evidencias_conferencia.jpg',
        ruta_almacenamiento: '/uploads/actividades/archivo_2_20240915_evidencias_conferencia.jpg',
        tipo_mime: 'image/jpeg',
        tamano_bytes: 1536000, // 1.5MB
        id_actividad: 2, // Proyecto de Investigación en IA
        fecha_subida: '2024-09-30'
      },
      {
        id_archivo: 3,
        nombre_original: 'informe_gestion_q3_2024.docx',
        nombre_almacenado: 'archivo_3_20240930_informe_gestion.docx',
        ruta_almacenamiento: '/uploads/reportes/archivo_3_20240930_informe_gestion.docx',
        tipo_mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        tamano_bytes: 3145728, // 3MB
        id_actividad: 1, // Taller de Metodologías Activas
        fecha_subida: '2024-09-10'
      },
      {
        id_archivo: 4,
        nombre_original: 'presupuesto_taller_metodologias.xlsx',
        nombre_almacenado: 'archivo_4_20240920_presupuesto_taller.xlsx',
        ruta_almacenamiento: '/uploads/actividades/archivo_4_20240920_presupuesto_taller.xlsx',
        tipo_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        tamano_bytes: 512000, // 500KB
        id_actividad: 1, // Taller de Metodologías Activas
        fecha_subida: '2024-09-15'
      },
      {
        id_archivo: 5,
        nombre_original: 'proyecto_ia_avances.pdf',
        nombre_almacenado: 'archivo_5_20240915_proyecto_ia.pdf',
        ruta_almacenamiento: '/uploads/reportes/archivo_5_20240915_proyecto_ia.pdf',
        tipo_mime: 'application/pdf',
        tamano_bytes: 4194304, // 4MB
        id_actividad: 3, // Semana Cultural Universitaria
        fecha_subida: '2024-09-15'
      },
      {
        id_archivo: 6,
        nombre_original: 'programa_semana_cultural.pdf',
        nombre_almacenado: 'archivo_6_20241001_programa_cultural.pdf',
        ruta_almacenamiento: '/uploads/actividades/archivo_6_20241001_programa_cultural.pdf',
        tipo_mime: 'application/pdf',
        tamano_bytes: 1024000, // 1MB
        id_actividad: 3, // Semana Cultural Universitaria
        fecha_subida: '2024-10-01'
      },
      {
        id_archivo: 7,
        nombre_original: 'informe_anual_2023_completo.pdf',
        nombre_almacenado: 'archivo_7_20240115_informe_anual.pdf',
        ruta_almacenamiento: '/uploads/reportes/archivo_7_20240115_informe_anual.pdf',
        tipo_mime: 'application/pdf',
        tamano_bytes: 8388608, // 8MB
        id_actividad: 4, // Simposio de Sostenibilidad
        fecha_subida: '2024-01-15'
      },
      {
        id_archivo: 8,
        nombre_original: 'evidencias_simposio_sostenibilidad.zip',
        nombre_almacenado: 'archivo_8_20240810_evidencias_simposio.zip',
        ruta_almacenamiento: '/uploads/actividades/archivo_8_20240810_evidencias_simposio.zip',
        tipo_mime: 'application/zip',
        tamano_bytes: 15728640, // 15MB
        id_actividad: 4, // Simposio de Sostenibilidad
        fecha_subida: '2024-08-10'
      },
      {
        id_archivo: 9,
        nombre_original: 'capacitacion_docente_septiembre.pptx',
        nombre_almacenado: 'archivo_9_20240930_capacitacion_docente.pptx',
        ruta_almacenamiento: '/uploads/reportes/archivo_9_20240930_capacitacion_docente.pptx',
        tipo_mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        tamano_bytes: 6291456, // 6MB
        id_actividad: 5, // Capacitación Docente
        fecha_subida: '2024-09-30'
      },
      {
        id_archivo: 10,
        nombre_original: 'bases_hackathon_estudiantil.pdf',
        nombre_almacenado: 'archivo_10_20241115_bases_hackathon.pdf',
        ruta_almacenamiento: '/uploads/actividades/archivo_10_20241115_bases_hackathon.pdf',
        tipo_mime: 'application/pdf',
        tamano_bytes: 768000, // 750KB
        id_actividad: 5, // Hackathon Estudiantil
        fecha_subida: '2024-11-15'
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('archivos', null, {});
  }
};