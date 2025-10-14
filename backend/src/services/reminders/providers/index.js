import InAppNotificationProvider from './InAppNotificationProvider.js';
import SmtpEmailProvider from './SmtpEmailProvider.js';

export function getReminderProvider() {
  const provider = (process.env.REMINDER_PROVIDER || 'notification').toLowerCase();
  switch (provider) {
    case 'smtp':
      return new SmtpEmailProvider();
    case 'notification':
    default:
      return new InAppNotificationProvider();
  }
}