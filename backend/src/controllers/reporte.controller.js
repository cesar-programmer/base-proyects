import boom from '@hapi/boom';
import puppeteer from 'puppeteer';
import { ReporteService } from '../services/index.js';

const reporteService = new ReporteService();

class ReporteController {
  // Obtener todos los reportes
  async getReportes(req, res, next) {
    try {
      const { page = 1, limit = 10, estado, actividadId, usuarioId, includeArchivados } = req.query;
      const filters = {};
      
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      if (usuarioId) filters.usuarioId = parseInt(usuarioId);
      if (includeArchivados) filters.includeArchivados = includeArchivados === 'true' || includeArchivados === true;

      // Si es administrador o coordinador, solo mostrar reportes que han sido enviados (tienen fechaEnvio)
      if (req.user.rol === 'ADMINISTRADOR' || req.user.rol === 'COORDINADOR') {
        filters.onlySubmitted = true;
      }

      const reportes = await reporteService.find({
        page: parseInt(page),
        limit: parseInt(limit),
        ...filters
      });

      res.json({
        message: 'Reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reporte por ID
  async getReporte(req, res, next) {
    try {
      const { id } = req.params;
      const reporte = await reporteService.findOne(id);
      
      res.json({
        message: 'Reporte obtenido exitosamente',
        data: reporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear nuevo reporte
  async createReporte(req, res, next) {
    try {
      const reporteData = req.body;
      
      // Si no es admin o coordinador, asignar el ID del usuario autenticado
      if (req.user.rol !== 'ADMINISTRADOR' && req.user.rol !== 'COORDINADOR') {
        reporteData.usuarioId = req.user.id;
      }
      
      // Obtener archivos si se subieron
      const archivos = req.files || [];
      
      const newReporte = await reporteService.create(reporteData, archivos);
      
      res.status(201).json({
        message: 'Reporte creado exitosamente',
        data: newReporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar reporte
  async updateReporte(req, res, next) {
    try {
      const { id } = req.params;
      const reporteData = req.body;
      
      // Verificar permisos: solo el usuario propietario o admin pueden actualizar
      const reporte = await reporteService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && req.user.rol !== 'COORDINADOR' && reporte.usuarioId !== req.user.id) {
        throw boom.forbidden('No tienes permisos para actualizar este reporte');
      }
      
      // Obtener archivos si se subieron
      const archivos = req.files || [];
      
      const updatedReporte = await reporteService.update(id, reporteData, archivos);
      
      res.json({
        message: 'Reporte actualizado exitosamente',
        data: updatedReporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar reporte
  async deleteReporte(req, res, next) {
    try {
      const { id } = req.params;
      
      // Verificar permisos
      const reporte = await reporteService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && req.user.rol !== 'COORDINADOR' && reporte.usuarioId !== req.user.id) {
        throw boom.forbidden('No tienes permisos para eliminar este reporte');
      }
      
      await reporteService.delete(id);
      
      res.json({
        message: 'Reporte eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar archivo de un reporte
  async removeArchivo(req, res, next) {
    try {
      const { id, archivoId } = req.params;
      
      // Verificar permisos: solo el usuario propietario o admin pueden eliminar archivos
      const reporte = await reporteService.findOne(id);
      if (req.user.rol !== 'ADMINISTRADOR' && req.user.rol !== 'COORDINADOR' && reporte.usuarioId !== req.user.id) {
        throw boom.forbidden('No tienes permisos para eliminar archivos de este reporte');
      }
      
      const result = await reporteService.removeArchivo(id, archivoId, req.user.id);
      
      res.json({
        message: 'Archivo eliminado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reportes por usuario
  async getReportesByDocente(req, res, next) {
    try {
      const { docenteId } = req.params;
      const { estado, actividadId, periodoAcademicoId, excludeArchivados } = req.query;
      
      // Verificar permisos: solo el usuario propietario o admin pueden ver
      if (req.user.rol !== 'ADMINISTRADOR' && req.user.rol !== 'COORDINADOR' && parseInt(docenteId) !== req.user.id) {
        throw boom.forbidden('No tienes permisos para ver estos reportes');
      }
      
      const filters = { usuarioId: parseInt(docenteId) };
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      if (periodoAcademicoId) filters.periodoAcademicoId = parseInt(periodoAcademicoId);
      if (excludeArchivados) filters.excludeArchivados = excludeArchivados === 'true' || excludeArchivados === true;
      
      const reportes = await reporteService.findByDocente(docenteId, filters);
      
      res.json({
        message: 'Reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reportes por actividad
  async getReportesByPeriod(req, res, next) {
    try {
      const { periodId } = req.params;
      const { estado } = req.query;
      
      const filters = {};
      if (estado) filters.estado = estado;
      
      const reportes = await reporteService.findByActividad(periodId, filters);
      
      res.json({
        message: 'Reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Cambiar estado del reporte
  async changeReporteStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { estado, comentariosRevision } = req.body;
      
      // Solo administradores o coordinadores pueden cambiar el estado
      if (req.user.rol !== 'ADMINISTRADOR' && req.user.rol !== 'COORDINADOR') {
        throw boom.forbidden('No tienes permisos para cambiar el estado del reporte');
      }
      
      const updatedReporte = await reporteService.changeStatus(
        id,
        estado,
        comentariosRevision,
        { bypassDeadline: true }
      );
      
      res.json({
        message: 'Estado del reporte actualizado exitosamente',
        data: updatedReporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Enviar reporte (para docentes) - cambiar de Pendiente a En revisión
  async enviarReporte(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Verificar que el reporte pertenece al docente (si no es administrador o coordinador)
      if (req.user.rol !== 'ADMINISTRADOR' && req.user.rol !== 'COORDINADOR') {
        const reporte = await reporteService.findOne(id);
        if (reporte.usuarioId !== userId) {
          throw boom.forbidden('No tienes permisos para enviar este reporte');
        }
        
        // Verificar que el reporte esté en un estado permitido para enviar
        const estadosPermitidosParaEnviar = ['borrador', 'pendiente', 'devuelto'];
        if (!estadosPermitidosParaEnviar.includes(reporte.estado)) {
          throw boom.badRequest('Solo se pueden enviar reportes en estado Borrador, Pendiente o Devuelto');
        }
      }
      
      const updatedReporte = await reporteService.changeStatus(id, 'enviado', '');
      
      res.json({
        message: 'Reporte enviado para revisión exitosamente',
        data: updatedReporte
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de reportes
  async getReporteStats(req, res, next) {
    try {
      const { actividadId, usuarioId } = req.query;
      const filters = {};
      
      if (actividadId) filters.actividadId = parseInt(actividadId);
      if (usuarioId) filters.usuarioId = parseInt(usuarioId);
      
      const stats = await reporteService.getStats(filters);
      
      res.json({
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener reportes pendientes para el dashboard
  async getPendingForDashboard(req, res, next) {
    try {
      const pendingReports = await reporteService.getPendingForDashboard();
      
      res.json({
        message: 'Reportes pendientes para dashboard obtenidos exitosamente',
        data: pendingReports
      });
    } catch (error) {
      next(error);
    }
  }



  // Obtener mis reportes (usuario autenticado)
  async getMyReportes(req, res, next) {
    try {
      const userId = req.user.id;
      const { estado, actividadId } = req.query;
      
      const filters = { usuarioId: userId };
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      
      const reportes = await reporteService.findByDocente(userId, filters);
      
      res.json({
        message: 'Mis reportes obtenidos exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener historial de reportes de un docente
  async getReportHistory(req, res, next) {
    try {
      const { docenteId } = req.query;
      
      if (!docenteId) {
        throw boom.badRequest('El parámetro docenteId es requerido');
      }
      
      const { estado, tipo, fechaInicio, fechaFin, excludeArchivados } = req.query;
      
      const filters = {};
      if (estado) filters.estado = estado;
      if (tipo) filters.tipo = tipo;
      if (fechaInicio) filters.fechaInicio = fechaInicio;
      if (fechaFin) filters.fechaFin = fechaFin;
      if (excludeArchivados) filters.excludeArchivados = excludeArchivados === 'true' || excludeArchivados === true;
      
      const reportes = await reporteService.findByDocente(parseInt(docenteId), filters);
      
      res.json({
        message: 'Historial de reportes obtenido exitosamente',
        data: reportes
      });
    } catch (error) {
      next(error);
    }
  }

  // Generar PDF del reporte
  async generateReportePDF(req, res, next) {
    try {
      const { id } = req.params;
      const reporte = await reporteService.findOne(id);
      
      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      // Log para depuración
      console.log('Datos del reporte para PDF:', {
        id: reporte.id,
        titulo: reporte.titulo,
        usuario: reporte.usuario ? {
          nombre: reporte.usuario.nombre,
          apellido: reporte.usuario.apellido
        } : null,
        actividades: reporte.actividades ? reporte.actividades.length : 0,
        estado: reporte.estado
      });

      // Obtener información adicional del período activo y fecha límite
      const deadlineInfo = await reporteService.getReportDeadlineInfo();

      // Generar HTML del reporte (plantilla formal)
      const htmlContent = this.generateReporteHTMLFormal(reporte, deadlineInfo);
      
      // Configurar puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      // Plantillas de encabezado y pie para numeración y metadatos
      const headerTemplate = `
        <div style="font-size:8pt; color:#334155; width:100%; padding:5mm 10mm; display:flex; justify-content:space-between;">
          <span>Sistema de Reportes Académicos</span>
          <span>${reporte.titulo || 'Reporte'}</span>
        </div>`;

      const footerTemplate = `
        <div style="font-size:8pt; color:#334155; width:100%; padding:0 10mm; display:flex; justify-content:space-between;">
          <span>Generado ${new Date().toLocaleDateString('es-ES')}</span>
          <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
        </div>`;

      // Generar PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate,
        footerTemplate,
        margin: {
          top: '25mm',
          right: '20mm',
          bottom: '15mm',
          left: '20mm'
        }
      });
      
      await browser.close();
      
      // Validar buffer generado
      if (!pdfBuffer || pdfBuffer.length === 0) {
        return res.status(500).json({ message: 'Error generando PDF del reporte' });
      }

      // Configurar headers para descarga y enviar binario explícito
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Reporte_${reporte.titulo || reporte.id}_${new Date().toISOString().split('T')[0]}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.status(200).end(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  // Generar HTML del reporte
  generateReporteHTML(reporte) {
    const fechaCreacion = reporte.fechaCreacion ? new Date(reporte.fechaCreacion).toLocaleDateString('es-ES') : 'No especificada';
    const fechaLimite = reporte.fechaLimite ? new Date(reporte.fechaLimite).toLocaleDateString('es-ES') : 'No especificada';
    const nombreCompleto = reporte.usuario ? `${reporte.usuario.nombre || ''} ${reporte.usuario.apellido || ''}`.trim() : 'No especificado';
    
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte - ${reporte.titulo}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
          }
          .info-card h3 {
            margin: 0 0 10px 0;
            color: #2563eb;
            font-size: 16px;
          }
          .info-card p {
            margin: 5px 0;
            font-size: 14px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .actividades-list {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
          }
          .actividad-item {
            background: white;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 6px;
            border-left: 4px solid #10b981;
          }
          .actividad-item:last-child {
            margin-bottom: 0;
          }
          .actividad-item h4 {
            margin: 0 0 8px 0;
            color: #374151;
          }
          .actividad-item p {
            margin: 4px 0;
            font-size: 14px;
            color: #6b7280;
          }
          .estado {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .estado.pendiente { background: #fef3c7; color: #92400e; }
          .estado.revision { background: #dbeafe; color: #1e40af; }
          .estado.aprobado { background: #d1fae5; color: #065f46; }
          .estado.aprobada { background: #d1fae5; color: #065f46; }
          .estado.devuelto { background: #fee2e2; color: #991b1b; }
          .estado.devuelta { background: #fee2e2; color: #991b1b; }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${reporte.titulo}</h1>
          <p>Reporte Académico - ${reporte.tipo}</p>
          <p>Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <h3>Información General</h3>
            <p><strong>Docente:</strong> ${nombreCompleto}</p>
            <p><strong>Estado:</strong> <span class="estado ${reporte.estado ? reporte.estado.toLowerCase().replace(' ', '') : 'pendiente'}">${reporte.estado || 'Pendiente'}</span></p>
            <p><strong>Semestre:</strong> ${reporte.semestre || 'No especificado'}</p>
            <p><strong>Año:</strong> ${reporte.año || 'No especificado'}</p>
          </div>
          <div class="info-card">
            <h3>Fechas Importantes</h3>
            <p><strong>Fecha de Creación:</strong> ${fechaCreacion}</p>
            <p><strong>Fecha Límite:</strong> ${fechaLimite}</p>
            <p><strong>Última Actualización:</strong> ${reporte.updatedAt ? new Date(reporte.updatedAt).toLocaleDateString('es-ES') : 'No disponible'}</p>
          </div>
        </div>

        ${reporte.resumenEjecutivo ? `
        <div class="section">
          <h2>Resumen Ejecutivo</h2>
          <p>${reporte.resumenEjecutivo}</p>
        </div>
        ` : ''}

        ${reporte.actividades && reporte.actividades.length > 0 ? `
        <div class="section">
          <h2>Actividades Registradas (${reporte.actividades.length})</h2>
          <div class="actividades-list">
            ${reporte.actividades.map(actividad => `
              <div class="actividad-item">
                <h4>${actividad.titulo || 'Sin título'}</h4>
                <p><strong>Descripción:</strong> ${actividad.descripcion || 'Sin descripción'}</p>
                <p><strong>Categoría:</strong> ${actividad.categoria || 'No especificada'}</p>
                <p><strong>Fecha Inicio:</strong> ${actividad.fechaInicio ? new Date(actividad.fechaInicio).toLocaleDateString('es-ES') : 'No especificada'}</p>
                <p><strong>Fecha Fin:</strong> ${actividad.fechaFin ? new Date(actividad.fechaFin).toLocaleDateString('es-ES') : 'No especificada'}</p>
                ${actividad.estado_realizado ? `<p><strong>Estado:</strong> <span class="estado ${actividad.estado_realizado.toLowerCase()}">${actividad.estado_realizado}</span></p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : `
        <div class="section">
          <h2>Actividades Registradas</h2>
          <p>No hay actividades registradas para este reporte.</p>
        </div>
        `}

        ${reporte.observaciones ? `
        <div class="section">
          <h2>Observaciones</h2>
          <p>${reporte.observaciones}</p>
        </div>
        ` : ''}

        ${reporte.comentariosRevision ? `
        <div class="section">
          <h2>Comentarios de Revisión</h2>
          <p>${reporte.comentariosRevision}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>Sistema de Reportes Académicos - Generado automáticamente</p>
          <p>Este documento contiene información confidencial del sistema académico</p>
        </div>
      </body>
      </html>
    `;
  }

  // Generar HTML del reporte con presentación formal
  generateReporteHTMLFormal(reporte, deadlineInfo = {}) {
    const nombreCompleto = reporte.usuario ? `${reporte.usuario.nombre || ''} ${reporte.usuario.apellido || ''}`.trim() : 'No especificado';
    const fechaGeneracion = `${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`;
    const estadoClase = reporte.estado ? reporte.estado.toLowerCase().replace(' ', '') : 'pendiente';

    // Campos derivados y correcciones
    const tipoReporte = reporte.titulo || 'Reporte';
    const fechaCreacion = reporte.createdAt ? new Date(reporte.createdAt).toLocaleDateString('es-ES') : 'No especificada';
    const semestre = deadlineInfo.semestre && deadlineInfo.semestre !== 'N/A' ? deadlineInfo.semestre : 'No especificado';
    const anio = (deadlineInfo.semestre && deadlineInfo.semestre !== 'N/A') 
      ? String(deadlineInfo.semestre).split('-')[0]
      : (reporte.createdAt ? String(new Date(reporte.createdAt).getFullYear()) : 'No especificado');
    const fechaLimite = (deadlineInfo.fechaLimite && deadlineInfo.fechaLimite !== 'N/A')
      ? new Date(deadlineInfo.fechaLimite).toLocaleDateString('es-ES')
      : 'No especificada';
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte - ${reporte.titulo}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
          .container { width: 100%; }
          .brand-header { display:flex; align-items:center; justify-content:space-between; border-bottom:1.5pt solid #0f172a; padding-bottom:12pt; margin-bottom:18pt; }
          .brand-title { font-weight:700; letter-spacing:0.5pt; font-size:14pt; }
          .doc-title { font-size:18pt; margin:0; font-weight:700; }
          .meta { font-size:10pt; color:#475569; }
          .kv-table { width:100%; border:0.75pt solid #cbd5e1; border-collapse:collapse; margin-bottom:14pt; }
          .kv-table th, .kv-table td { border:0.75pt solid #cbd5e1; padding:6pt 8pt; vertical-align:top; }
          .kv-table th { background:#f1f5f9; text-align:left; font-weight:700; }
          .section-title { font-size:12pt; font-weight:700; border-bottom:0.75pt solid #cbd5e1; margin:18pt 0 8pt; padding-bottom:6pt; }
          .paragraph { text-align: justify; }
          .table { width:100%; border-collapse:collapse; margin-top:6pt; border:0.75pt solid #cbd5e1; }
          .table th, .table td { border:0.75pt solid #cbd5e1; padding:6pt 8pt; }
          .table thead th { background:#f1f5f9; font-weight:700; text-align:left; }
          .estado { font-weight:700; }
          .estado.pendiente { color:#92400e; } .estado.revision { color:#1e40af; }
          .estado.aprobado, .estado.aprobada { color:#065f46; } .estado.devuelto, .estado.devuelta { color:#991b1b; }
          .signatures { display:grid; grid-template-columns:1fr 1fr; gap:24pt; margin-top:24pt; }
          .sig { text-align:center; }
          .line { border-top:0.75pt solid #0f172a; margin:32pt 0 6pt; }
          .small { font-size:10pt; color:#475569; }
          .footer-note { margin-top:18pt; font-size:10pt; color:#475569; border-top:0.75pt solid #cbd5e1; padding-top:10pt; text-align:center; }
          .no-break { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand-header">
            <div>
              <div class="brand-title">Sistema de Reportes Académicos</div>
              <div class="meta">Generado: ${fechaGeneracion}</div>
            </div>
            <div class="doc-title">${reporte.titulo}</div>
          </div>

          <table class="kv-table no-break">
            <tbody>
              <tr><th style="width:25%">Tipo de reporte</th><td>${tipoReporte}</td></tr>
              <tr><th>Docente</th><td>${nombreCompleto}</td></tr>
              <tr><th>Semestre</th><td>${semestre}</td></tr>
              <tr><th>Año</th><td>${anio}</td></tr>
              <tr><th>Fecha de creación</th><td>${fechaCreacion}</td></tr>
              <tr><th>Fecha límite</th><td>${fechaLimite}</td></tr>
              <tr><th>Última actualización</th><td>${reporte.updatedAt ? new Date(reporte.updatedAt).toLocaleDateString('es-ES') : 'No disponible'}</td></tr>
            </tbody>
          </table>

          ${reporte.resumenEjecutivo ? `
          <div class="no-break">
            <div class="section-title">Resumen ejecutivo</div>
            <p class="paragraph">${reporte.resumenEjecutivo}</p>
          </div>
          ` : ''}

          ${reporte.actividades && reporte.actividades.length > 0 ? `
          <div>
            <div class="section-title">Actividades registradas (${reporte.actividades.length})</div>
            <table class="table">
              <thead>
                <tr>
                  <th style="width:38%">Actividad</th>
                  <th style="width:20%">Categoría</th>
                  <th style="width:28%">Periodo</th>
                  <th style="width:14%">Horas</th>
                </tr>
              </thead>
              <tbody>
                ${reporte.actividades.map(actividad => `
                  <tr>
                    <td><strong>${actividad.titulo || 'Sin título'}</strong><br>${actividad.descripcion || ''}</td>
                    <td>${actividad.categoria || 'No especificada'}</td>
                    <td>${actividad.fechaInicio ? new Date(actividad.fechaInicio).toLocaleDateString('es-ES') : 'No especificada'} — ${actividad.fechaFin ? new Date(actividad.fechaFin).toLocaleDateString('es-ES') : 'No especificada'}</td>
                    <td>${typeof actividad.horas_dedicadas === 'number' ? actividad.horas_dedicadas : (actividad.horas || actividad.horas_dedicadas || '—')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : `
          <div class="no-break">
            <div class="section-title">Actividades registradas</div>
            <p class="paragraph">No hay actividades registradas para este reporte.</p>
          </div>
          `}

          ${reporte.observaciones ? `
          <div class="no-break">
            <div class="section-title">Observaciones</div>
            <p class="paragraph">${reporte.observaciones}</p>
          </div>
          ` : ''}

          ${reporte.comentariosRevision ? `
          <div class="no-break">
            <div class="section-title">Comentarios de revisión</div>
            <p class="paragraph">${reporte.comentariosRevision}</p>
          </div>
          ` : ''}

          
        </div>
      </body>
      </html>
    `;
  }

  // Obtener información de fecha límite y semestre
  async getDeadlineInfo(req, res, next) {
    try {
      const deadlineInfo = await reporteService.getReportDeadlineInfo();
      
      res.json({
        message: 'Información de fecha límite obtenida exitosamente',
        data: deadlineInfo
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener información de fecha límite para REGISTRO de actividades
  async getRegistroDeadlineInfo(req, res, next) {
    try {
      const deadlineInfo = await reporteService.getRegistroDeadlineInfo();
      
      res.json({
        message: 'Información de fecha límite de registro obtenida exitosamente',
        data: deadlineInfo
      });
    } catch (error) {
      next(error);
    }
  }

  // Aprobar reporte
  async approveReporte(req, res, next) {
    try {
      const { id } = req.params;
      const { comentarios = '' } = req.body;
      const revisadoPorId = req.user.id;

      const result = await reporteService.approve(id, comentarios, revisadoPorId);
      
      res.json({
        message: result.message,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  // Rechazar reporte
  async rejectReporte(req, res, next) {
    try {
      const { id } = req.params;
      const { razon } = req.body;
      const revisadoPorId = req.user?.id;

      console.log('=== DEBUG REJECT REPORTE ===');
      console.log('ID del reporte:', id);
      console.log('Razón:', razon);
      console.log('Usuario:', req.user);
      console.log('revisadoPorId:', revisadoPorId);

      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón del rechazo es requerida');
      }

      if (!revisadoPorId) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const result = await reporteService.reject(id, razon, revisadoPorId);
      
      res.json({
        message: result.message,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  // Aprobar reporte rápidamente
  async quickApproveReporte(req, res, next) {
    try {
      const { id } = req.params;
      const revisadoPorId = req.user.id;

      const result = await reporteService.quickApprove(id, revisadoPorId);
      
      res.json({
        message: result.message,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  // Devolver reporte a pendiente
  async returnReporteToPending(req, res, next) {
    try {
      const { id } = req.params;
      const { razon } = req.body;
      const revisadoPorId = req.user.id;

      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón para devolver a pendiente es requerida');
      }

      const result = await reporteService.returnToPending(id, razon, revisadoPorId);
      
      res.json({
        message: result.message,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  // Devolver reporte a revisión
  async returnReporteToReview(req, res, next) {
    try {
      const { id } = req.params;
      const { razon } = req.body;
      const revisadoPorId = req.user.id;

      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón para devolver a revisión es requerida');
      }

      const result = await reporteService.returnToReview(id, razon, revisadoPorId);
      
      res.json({
        message: result.message,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar estado del reporte
  async updateReporteStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { estado, comentarios } = req.body;
      const revisadoPorId = req.user.id;

      const result = await reporteService.updateStatus(id, estado, comentarios, revisadoPorId);
      
      res.json({
        message: result.message,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  // Archivar reporte
  async archiveReporte(req, res, next) {
    try {
      const { id } = req.params;
      const { archivar } = req.body;
      
      if (typeof archivar === 'undefined') {
        throw boom.badRequest('El campo archivar es requerido');
      }

      const updated = await reporteService.archive(parseInt(id), archivar === true || archivar === 'true', req.user.id);

      res.json({
        message: archivar ? 'Reporte archivado exitosamente' : 'Reporte desarchivado exitosamente',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }


}

export default ReporteController;