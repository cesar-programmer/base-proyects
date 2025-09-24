import boom from '@hapi/boom';
import puppeteer from 'puppeteer';
import { ReporteService } from '../services/index.js';

const reporteService = new ReporteService();

class ReporteController {
  // Obtener todos los reportes
  async getReportes(req, res, next) {
    try {
      const { page = 1, limit = 10, estado, actividadId, usuarioId } = req.query;
      const filters = {};
      
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      if (usuarioId) filters.usuarioId = parseInt(usuarioId);

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
      
      // Si no es admin, asignar el ID del usuario autenticado
      if (req.user.rol !== 'ADMINISTRADOR') {
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
      if (req.user.rol !== 'ADMINISTRADOR' && reporte.usuarioId !== req.user.id) {
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
      if (req.user.rol !== 'ADMINISTRADOR' && reporte.usuarioId !== req.user.id) {
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
      if (req.user.rol !== 'ADMINISTRADOR' && reporte.usuarioId !== req.user.id) {
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
      const { estado, actividadId } = req.query;
      
      // Verificar permisos: solo el usuario propietario o admin pueden ver
      if (req.user.rol !== 'ADMINISTRADOR' && parseInt(docenteId) !== req.user.id) {
        throw boom.forbidden('No tienes permisos para ver estos reportes');
      }
      
      const filters = { usuarioId: parseInt(docenteId) };
      if (estado) filters.estado = estado;
      if (actividadId) filters.actividadId = parseInt(actividadId);
      
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
      
      // Solo administradores pueden cambiar el estado
      if (req.user.rol !== 'ADMINISTRADOR') {
        throw boom.forbidden('No tienes permisos para cambiar el estado del reporte');
      }
      
      const updatedReporte = await reporteService.changeStatus(id, estado, comentariosRevision);
      
      res.json({
        message: 'Estado del reporte actualizado exitosamente',
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

  // Obtener reportes pendientes de revisión
  async getReportesPendingReview(req, res, next) {
    try {
      // Solo administradores pueden ver reportes pendientes
      if (req.user.rol !== 'ADMINISTRADOR') {
        throw boom.forbidden('No tienes permisos para ver reportes pendientes');
      }
      
      const reportes = await reporteService.findPendingReview();
      
      res.json({
        message: 'Reportes pendientes obtenidos exitosamente',
        data: reportes
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
      
      const { estado, tipo, fechaInicio, fechaFin } = req.query;
      
      const filters = {};
      if (estado) filters.estado = estado;
      if (tipo) filters.tipo = tipo;
      if (fechaInicio) filters.fechaInicio = fechaInicio;
      if (fechaFin) filters.fechaFin = fechaFin;
      
      const reportes = await reporteService.getReportHistory(parseInt(docenteId), filters);
      
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

      // Generar HTML del reporte
      const htmlContent = this.generateReporteHTML(reporte);
      
      // Configurar puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      // Generar PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });
      
      await browser.close();
      
      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Reporte_${reporte.titulo || reporte.id}_${new Date().toISOString().split('T')[0]}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
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
}

export default ReporteController;