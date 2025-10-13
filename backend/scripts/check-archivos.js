import 'dotenv/config';
import { sequelize, models } from '../src/db/models/index.js';

async function main() {
  const args = process.argv.slice(2);
  const params = Object.fromEntries(args.map(a => {
    const [k, v] = a.split('=');
    return [k, v];
  }));

  const reporteId = params.reporteId ? parseInt(params.reporteId, 10) : null;
  const actividadId = params.actividadId ? parseInt(params.actividadId, 10) : null;

  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a BD OK');

    const where = {};
    if (reporteId) where.reporteId = reporteId;
    if (actividadId) where.actividadId = actividadId;

    const archivos = await models.Archivo.findAll({
      where,
      order: [['fecha_subida', 'DESC']],
      raw: true
    });

    console.log(`📄 Archivos (${archivos.length})`, archivos);

    if (reporteId) {
      const reporte = await models.Reporte.findByPk(reporteId, {
        include: [{ association: 'archivos' }]
      });
      console.log('🧾 Reporte con archivos (include):', {
        id: reporte?.id,
        titulo: reporte?.titulo,
        archivos: Array.isArray(reporte?.archivos) ? reporte.archivos.map(a => ({ id: a.id, nombre: a.nombre_original, reporteId: a.reporteId })) : []
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error consultando archivos:', err);
    process.exit(1);
  }
}

main();