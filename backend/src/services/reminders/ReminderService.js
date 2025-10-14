import { models } from '../../db/models/index.js';
import { getReminderProvider } from './providers/index.js';

export default class ReminderService {
  constructor() {
    this.provider = getReminderProvider();
  }

  async getConfig() {
    const row = await models.Configuracion.findOne({ where: { clave: 'recordatorios.configuracion' } });
    return row ? JSON.parse(row.valor) : null;
  }

  async getRecipients(tipo = 'todos') {
    const where = { activo: true };
    const users = await models.User.findAll({
      where,
      attributes: ['id','nombre','apellido','email'],
      include: [{ model: models.Role, as: 'rol', attributes: ['nombre'] }],
      order: [['nombre','ASC']]
    });
    // TODO: implementar filtro real para 'pendientes' cuando haya criterio definido
    return users.map(u => ({ id: u.id, nombre: `${u.nombre} ${u.apellido}`, email: u.email, rol: u.rol?.nombre }));
  }

  async sendReminder({ mensaje, destinatarios }) {
    let recipients = await this.getRecipients(destinatarios);
    // Soporte para limitar a un único destinatario en envíos manuales
    // Opciones: usuarioId, email, limit=1
    // Nota: estos campos pueden venir en el body del controlador
    const { usuarioId, email, limit } = arguments[0] || {};

    if (usuarioId) {
      const user = await models.User.findByPk(usuarioId, {
        attributes: ['id','nombre','apellido','email'],
        include: [{ model: models.Role, as: 'rol', attributes: ['nombre'] }]
      });
      recipients = user ? [{ id: user.id, nombre: `${user.nombre} ${user.apellido}`, email: user.email, rol: user.rol?.nombre }] : [];
    } else if (email) {
      const user = await models.User.findOne({
        where: { email, activo: true },
        attributes: ['id','nombre','apellido','email'],
        include: [{ model: models.Role, as: 'rol', attributes: ['nombre'] }]
      });
      recipients = user ? [{ id: user.id, nombre: `${user.nombre} ${user.apellido}`, email: user.email, rol: user.rol?.nombre }] : [];
    } else if (Number(limit) === 1 && recipients.length > 1) {
      recipients = recipients.slice(0,1);
    }

    const result = await this.provider.send({
      recipients,
      message: mensaje,
      meta: { tipo: 'RECORDATORIO', subject: 'Recordatorio UABC - Actividades Pendientes' }
    });
    return { ...result, recipients };
  }
}