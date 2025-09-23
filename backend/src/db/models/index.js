import { Sequelize } from 'sequelize';
import { Role, RoleSchema } from './role.model.js';
import { Permiso, PermisoSchema } from './permiso.model.js';
import { User, UserSchema } from './user.model.js';
import { PeriodoAcademico, PeriodoAcademicoSchema } from './periodoAcademico.model.js';
import { FechaLimite, FechaLimiteSchema } from './fechaLimite.model.js';
import { CatalogoActividad, CatalogoActividadSchema } from './catalogoActividad.model.js';
import { Reporte, ReporteSchema } from './reporte.model.js';
import { Actividad, ActividadSchema } from './actividad.model.js';
import { Archivo, ArchivoSchema } from './archivo.model.js';
import { Notificacion, NotificacionSchema } from './notificacion.model.js';
import { HistorialCambio, HistorialCambioSchema } from './historialCambio.model.js';
import { Configuracion, ConfiguracionSchema } from './configuracion.model.js';
import { ReporteActividad, ReporteActividadSchema } from './reporteActividad.model.js';


// Configuración de la base de datos (se puede mover a un archivo de configuración separado)
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || (process.env.NODE_ENV === 'test' ? 'reportes_db_test' : 'reportesdb'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    freezeTableName: true, // Evita que Sequelize pluralice los nombres de las tablas
    underscored: false, // Usamos camelCase en los nombres de campos
    timestamps: true // Usamos timestamps automáticos
  }
});

// Inicializar todos los modelos
const models = {
  Role: Role.init(RoleSchema, Role.config(sequelize)),
  Permiso: Permiso.init(PermisoSchema, Permiso.config(sequelize)),
  User: User.init(UserSchema, User.config(sequelize)),
  PeriodoAcademico: PeriodoAcademico.init(PeriodoAcademicoSchema, PeriodoAcademico.config(sequelize)),
  FechaLimite: FechaLimite.init(FechaLimiteSchema, FechaLimite.config(sequelize)),
  CatalogoActividad: CatalogoActividad.init(CatalogoActividadSchema, CatalogoActividad.config(sequelize)),
  Reporte: Reporte.init(ReporteSchema, Reporte.config(sequelize)),
  Actividad: Actividad.init(ActividadSchema, Actividad.config(sequelize)),
  Archivo: Archivo.init(ArchivoSchema, Archivo.config(sequelize)),
  Notificacion: Notificacion.init(NotificacionSchema, Notificacion.config(sequelize)),
  HistorialCambio: HistorialCambio.init(HistorialCambioSchema, HistorialCambio.config(sequelize)),
  Configuracion: Configuracion.init(ConfiguracionSchema, Configuracion.config(sequelize)),
  ReporteActividad: ReporteActividad.init(ReporteActividadSchema, ReporteActividad.config(sequelize))
};

// Establecer todas las asociaciones
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Función para sincronizar la base de datos
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
    throw error;
  }
};

// Función para autenticar la conexión
const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

// Función para cerrar la conexión
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión a la base de datos:', error);
    throw error;
  }
};

export {
  sequelize,
  models,
  syncDatabase,
  authenticateDatabase,
  closeDatabase,
  // Individual model exports
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
  ReporteActividad
};
