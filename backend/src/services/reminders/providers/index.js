import InAppNotificationProvider from './InAppNotificationProvider.js';
import SmtpEmailProvider from './SmtpEmailProvider.js';
import GmailEmailProvider from './GmailEmailProvider.js';

export function getReminderProvider() {
  const provider = (process.env.REMINDER_PROVIDER || 'notification').toLowerCase();
  switch (provider) {
    case 'gmail':
      return new GmailEmailProvider();
    case 'smtp':
      return new SmtpEmailProvider();
    case 'notification':
    default:
      return new InAppNotificationProvider();
  }
}