import ReminderService from '../services/reminders/ReminderService.js';

let currentTimeout = null;
const oneOffJobs = new Map();
const reminderService = new ReminderService();
const MAX_TIMEOUT_MS = 2147483647; // ~24.85 días, límite de setTimeout en Node

function calculateNextRun(config) {
  const now = new Date();
  const [h, m] = (config.hora || '09:00').split(':').map(Number);
  const next = new Date();
  next.setSeconds(0, 0);
  next.setHours(h, m, 0, 0);

  const map = { lunes:1, martes:2, miercoles:3, jueves:4, viernes:5, sabado:6, domingo:0 };
  if (config.frecuencia === 'diario') {
    if (next <= now) next.setDate(next.getDate() + 1);
  } else if (config.frecuencia === 'semanal') {
    const desired = map[config.dia_semana] ?? 1;
    const curr = next.getDay();
    let delta = desired - curr;
    if (delta <= 0 || (delta === 0 && next <= now)) delta += 7;
    next.setDate(next.getDate() + delta);
  } else if (config.frecuencia === 'mensual') {
    if (next <= now) next.setMonth(next.getMonth() + 1);
  }
  return next;
}

async function runOnce(config) {
  try {
    const result = await reminderService.sendReminder(config);
    if (result?.ok) {
      console.log(`[ReminderScheduler] Enviado: count=${result.count} provider=${result.provider || 'unknown'}`);
    } else {
      console.warn(`[ReminderScheduler] Falló envío: count=${result?.count || 0} failed=${(result?.failed?.length) || 0} provider=${result?.provider || 'unknown'} reason=${result?.reason || 'unknown'}`);
    }
  } catch (e) {
    console.error('[ReminderScheduler] Error enviando recordatorio:', e);
  }
}

function scheduleNext(config) {
  const next = calculateNextRun(config);
  const targetTs = next.getTime();
  clearTimeout(currentTimeout);

  const chain = async () => {
    const remaining = targetTs - Date.now();
    if (remaining > MAX_TIMEOUT_MS) {
      currentTimeout = setTimeout(chain, MAX_TIMEOUT_MS);
      return;
    }
    currentTimeout = setTimeout(async () => {
      await runOnce(config);
      scheduleNext(config);
    }, Math.max(0, remaining));
  };

  chain();
  console.log(`[ReminderScheduler] Próxima ejecución: ${next.toISOString()}`);
}

export async function initReminderScheduler() {
  const config = await reminderService.getConfig();
  if (config?.activo) scheduleNext(config);
  else console.log('[ReminderScheduler] Inactivo. No se programará.');
}

export async function reloadSchedule() {
  const config = await reminderService.getConfig();
  clearTimeout(currentTimeout);
  if (config?.activo) scheduleNext(config);
  else console.log('[ReminderScheduler] Desactivado. Temporizador limpiado.');
}

export function scheduleOneOff(config, fechaISO) {
  const when = new Date(fechaISO);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const targetTs = when.getTime();

  const chain = async () => {
    const remaining = targetTs - Date.now();
    if (remaining > MAX_TIMEOUT_MS) {
      const t = setTimeout(chain, MAX_TIMEOUT_MS);
      oneOffJobs.set(id, t);
      return;
    }
    const t = setTimeout(async () => {
      await runOnce(config);
      oneOffJobs.delete(id);
    }, Math.max(0, remaining));
    oneOffJobs.set(id, t);
  };

  chain();
  return { id, fecha: when.toISOString() };
}

export function cancelOneOff(id) {
  const t = oneOffJobs.get(id);
  if (t) {
    clearTimeout(t);
    oneOffJobs.delete(id);
    return true;
  }
  return false;
}