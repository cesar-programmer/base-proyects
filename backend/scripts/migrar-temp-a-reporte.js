import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises';

// Ajusta estas importaciones según tu proyecto
import { sequelize, models } from '../src/db/models/index.js';

async function main() {
  try {
    const arg = process.argv.find(a => a.startsWith('reporteId='));
    if (!arg) {
      console.error('Uso: node scripts/migrar-temp-a-reporte.js reporteId=<ID>');
      process.exit(1);
    }
    const reporteId = Number(arg.split('=')[1]);
    if (!Number.isInteger(reporteId) || reporteId <= 0) {
      console.error('El reporteId debe ser un entero positivo.');
      process.exit(1);
    }

    const projectRoot = process.cwd();
    const uploadsRoot = path.join(projectRoot, 'backend', 'uploads');
    const tempDir = path.join(uploadsRoot, 'temp');
    const destinoDir = path.join(uploadsRoot, 'reportes', String(reporteId));

    // Asegura que el destino exista
    await fs.mkdir(destinoDir, { recursive: true });

    // Lista archivos en temp
    let entries;
    try {
      entries = await fs.readdir(tempDir, { withFileTypes: true });
    } catch (e) {
      console.error(`No se pudo leer ${tempDir}. ¿Existe?`, e.message);
      process.exit(1);
    }

    const pdfs = entries
      .filter(d => d.isFile())
      .map(d => d.name)
      .filter(name => name.toLowerCase().endsWith('.pdf'));

    if (pdfs.length === 0) {
      console.log('No se encontraron PDF en uploads/temp. Nada que migrar.');
      process.exit(0);
    }

    console.log(`Migrando ${pdfs.length} PDF(s) desde temp a reporte ${reporteId}...`);

    const resultados = { migrados: [], omitidos: [], errores: [] };

    for (const filename of pdfs) {
      const origen = path.join(tempDir, filename);
      const destino = path.join(destinoDir, filename);

      try {
        // Evita duplicados en BD
        const existente = await models.Archivo?.findOne?.({
          where: { nombre_almacenado: filename },
        });
        if (existente) {
          resultados.omitidos.push({ filename, motivo: 'Registro ya existe para este reporte' });
          continue;
        }

        // Mueve el archivo físicamente (si ya existe en destino, lo omite)
        let yaExistiaEnDestino = false;
        try {
          await fs.access(destino);
          yaExistiaEnDestino = true;
        } catch {}

        if (!yaExistiaEnDestino) {
          await fs.rename(origen, destino);
        }

        const stat = await fs.stat(destino);

        // Crea el registro en BD
        // Ajusta los campos según tu modelo real
        const nuevo = await models.Archivo.create({
          nombre_original: filename,
          nombre_almacenado: filename,
          ruta_almacenamiento: destino,
          tipo_mime: 'application/pdf',
          tamano_bytes: stat.size,
          descripcion: 'Migrado desde uploads/temp',
          categoria: 'evidencia',
          reporteId: reporteId,
          actividadId: null,
        });

        resultados.migrados.push({ filename, id_archivo: nuevo.id });
      } catch (e) {
        resultados.errores.push({ filename, error: e.message });
      }
    }

    console.log('Resumen de migración:');
    console.table({
      migrados: resultados.migrados.length,
      omitidos: resultados.omitidos.length,
      errores: resultados.errores.length,
    });

    if (resultados.omitidos.length) {
      console.log('Omitidos:', resultados.omitidos);
    }
    if (resultados.errores.length) {
      console.log('Errores:', resultados.errores);
    }

    await sequelize.close();
  } catch (e) {
    console.error('Fallo general en migración:', e);
    try { await sequelize.close(); } catch {}
    process.exit(1);
  }
}

main();