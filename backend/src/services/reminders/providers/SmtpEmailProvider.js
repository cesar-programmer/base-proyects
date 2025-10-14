let nodemailer;
try {
  nodemailer = await import('nodemailer');
} catch {
  nodemailer = null;
}

export default class SmtpEmailProvider {
  constructor(options = {}) {
    this.options = options;
    this.available = !!nodemailer;
    const isDebug = process.env.SMTP_DEBUG === 'true';
    this.transporter = nodemailer?.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      logger: isDebug,
      debug: isDebug
    });
    this.from = process.env.SMTP_FROM || 'no-reply@uabc.edu';
  }

  async send({ recipients, message, meta = {} }) {
    if (!this.available) {
      console.warn('[SmtpEmailProvider] nodemailer no disponible, haciendo fallback a consola.');
      console.log(`[Email Preview] To:${recipients.map(r=>r.email).join(', ')} | Subject:${meta.subject || 'Recordatorio'} | Body:${message}`);
      return { ok: true, count: recipients.length, preview: true, provider: 'smtp' };
    }

    const subject = meta.subject || 'Recordatorio UABC - Actividades Pendientes';
    const sent = [];
    const failed = [];

    // Verificar transporte solo cuando está habilitado el debug
    try {
      if (process.env.SMTP_DEBUG === 'true') {
        await this.transporter.verify();
        console.log('[SMTP] Transport verified successfully');
      }
    } catch (e) {
      console.error('[SMTP] Transport verify failed:', e?.message || e);
    }

    if (!recipients || recipients.length === 0) {
      console.warn('[SMTP] No hay destinatarios para enviar.');
      return { ok: false, count: 0, failed, provider: 'smtp', reason: 'no_recipients' };
    }

    for (const u of recipients) {
      try {
        const info = await this.transporter.sendMail({
          from: this.from,
          to: u.email,
          subject,
          text: message
        });
        if (process.env.SMTP_DEBUG === 'true') {
          console.log(`[SMTP] Sent to ${u.email} messageId=${info.messageId} response=${info.response}`);
        }
        sent.push(info);
      } catch (err) {
        console.error(`[SMTP] Error sending to ${u.email}:`, err?.message || err);
        failed.push({ email: u.email, error: err?.message || String(err) });
      }
    }

    return { ok: sent.length > 0, count: sent.length, failed, provider: 'smtp' };
  }
}