import PQueue from 'p-queue';
import archivoService from './archivoService';

// Upload Manager: controla concurrencia, progreso y cancelación
class UploadManager {
  constructor({ concurrency = 3 } = {}) {
    this.queue = new PQueue({ concurrency });
    this.controllers = new Map(); // Map<fileId, AbortController>
  }

  // Genera un ID determinista para un archivo
  getFileId(file) {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  // Cancela la subida de un archivo específico
  cancel(file) {
    const id = this.getFileId(file);
    const controller = this.controllers.get(id);
    if (controller) controller.abort();
  }

  // Cancela todas las subidas en curso
  cancelAll() {
    for (const controller of this.controllers.values()) {
      controller.abort();
    }
    this.controllers.clear();
  }

  // Sube múltiples archivos con opciones
  async uploadFiles(files, { actividadId = null, reporteId = null, descripcion = '', categoria = 'evidencia', onProgress = () => {} } = {}) {
    const results = [];

    const tasks = files.map((file) => async () => {
      const id = this.getFileId(file);
      const controller = new AbortController();
      this.controllers.set(id, controller);

      try {
        const response = await archivoService.uploadArchivo(
          file,
          actividadId,
          descripcion,
          categoria,
          {
            signal: controller.signal,
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total || file.size || 0;
              const loaded = progressEvent.loaded || 0;
              const percent = total ? Math.round((loaded / total) * 100) : 0;
              onProgress({ file, id, loaded, total, percent });
            },
            reporteId
          }
        );

        results.push({ file, success: true, data: response });
      } catch (error) {
        const aborted = controller.signal.aborted;
        results.push({ file, success: false, error: aborted ? new Error('Upload cancelado') : error });
      } finally {
        this.controllers.delete(id);
      }
    });

    // Encolar tareas respetando la concurrencia
    for (const task of tasks) {
      this.queue.add(task);
    }

    await this.queue.onIdle();
    return results;
  }
}

export default UploadManager;