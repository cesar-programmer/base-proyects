let nodemailer;
try {
  nodemailer = await import('nodemailer');
} catch {
  nodemailer = null;
}

export default class GmailEmailProvider {
  constructor(options = {}) {
    this.options = options;
    this.available = !!nodemailer;
    const isDebug = process.env.SMTP_DEBUG === 'true';
    this.transporter = nodemailer?.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER || process.env.SMTP_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_ACCESS_TOKEN
      },
      logger: isDebug,
      debug: isDebug
    });
    this.from = process.env.SMTP_FROM || process.env.GMAIL_USER || 'no-reply@uabc.edu';
  }

  async send({ recipients, message, meta = {} }) {
    if (!this.available) {
      console.warn('[GmailEmailProvider] nodemailer no disponible, fallback a consola.');
      console.log(`[Email Preview] To:${recipients.map(r=>r.email).join(', ')} | Subject:${meta.subject || 'Recordatorio'} | Body:${message}`);
      return { ok: true, count: recipients.length, preview: true, provider: 'gmail' };
    }

    const subject = meta.subject || 'Recordatorio UABC - Actividades Pendientes';
    const sent = [];
    const failed = [];

    try {
      if (process.env.SMTP_DEBUG === 'true') {
        await this.transporter.verify();
        console.log('[GMAIL] Transport verified successfully');
      }
    } catch (e) {
      console.error('[GMAIL] Transport verify failed:', e?.message || e);
    }

    if (!recipients || recipients.length === 0) {
      console.warn('[GMAIL] No hay destinatarios para enviar.');
      return { ok: false, count: 0, failed, provider: 'gmail', reason: 'no_recipients' };
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
          console.log(`[GMAIL] Sent to ${u.email} messageId=${info.messageId} response=${info.response}`);
        }
        sent.push(info);
      } catch (err) {
        console.error(`[GMAIL] Error sending to ${u.email}:`, err?.message || err);
        failed.push({ email: u.email, error: err?.message || String(err) });
      }
    }

    return { ok: sent.length > 0, count: sent.length, failed, provider: 'gmail' };
  }
}