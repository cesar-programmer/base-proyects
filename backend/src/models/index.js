// Re-exportar todos los modelos desde la carpeta db/models
export {
  Role,
  Permiso,
  User,
  PeriodoAcademico,
  FechaLimite,
  CatalogoActividad,
  Reporte,
  Actividad,
  Archivo,
  Notificacion,
  HistorialCambio,
  Configuracion,
  models,
  sequelize
} from '../db/models/index.js';