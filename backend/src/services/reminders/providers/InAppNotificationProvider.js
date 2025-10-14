import NotificacionService from '../../notificacion.service.js';

export default class InAppNotificationProvider {
  constructor() {
    this.notificacionService = new NotificacionService();
  }

  async send({ recipients, message, meta = {} }) {
    const created = [];
    for (const u of recipients) {
      const notif = await this.notificacionService.create({
        id_usuario_destino: u.id,
        mensaje: message,
        tipo: meta.tipo || 'RECORDATORIO'
      });
      created.push(notif);
    }
    return { ok: true, count: created.length };
  }
}