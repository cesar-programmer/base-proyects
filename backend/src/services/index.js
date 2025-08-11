// Exportar todos los servicios del sistema
const RoleService = require('./role.service');
const UserService = require('./user.service');
const FechaLimiteService = require('./fechaLimite.service');
const ReporteService = require('./reporte.service');
const ActividadService = require('./actividad.service');
const NotificacionService = require('./notificacion.service');
const CatalogoActividadService = require('./catalogoActividad.service');
const EstadisticaService = require('./estadistica.service');

module.exports = {
  RoleService,
  UserService,
  FechaLimiteService,
  ReporteService,
  ActividadService,
  NotificacionService,
  CatalogoActividadService,
  EstadisticaService
};
