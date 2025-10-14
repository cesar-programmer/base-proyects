# Módulo de Recordatorios y Envíos de Correo

Este módulo permite enviar recordatorios a los docentes mediante dos mecanismos:
- Notificaciones internas (InApp) que se guardan en la base de datos.
- Correos electrónicos vía SMTP.

Incluye un servicio unificado, proveedores intercambiables y un scheduler para envíos automáticos según una configuración almacenada en la tabla `Configuracion`.

## Arquitectura

- `ReminderService` (`src/services/reminders/ReminderService.js`)
  - Obtiene la configuración `recordatorios.configuracion` desde BD.
  - Resuelve destinatarios activos (y en el futuro filtra “pendientes”).
  - Delega el envío al proveedor seleccionado.

- Proveedores (`src/services/reminders/providers/`)
  - `InAppNotificationProvider.js`: crea entradas en `Notificacion` usando `NotificacionService`.
  - `SmtpEmailProvider.js`: envía correos con `nodemailer` o hace preview en consola si no está disponible.
  - `index.js`: selector por variable de entorno `REMINDER_PROVIDER`.

- Scheduler (`src/scheduler/recordatorio.scheduler.js`)
  - `initReminderScheduler()`: programa la próxima ejecución si la configuración está activa.
  - `reloadSchedule()`: recarga la programación tras cambios de configuración o estado.
  - `scheduleOneOff(config, fechaISO)`: programa una ejecución puntual y devuelve `id`.
  - `cancelOneOff(id)`: cancela una ejecución puntual.

- Integración
  - Controlador: `src/controllers/recordatorio.controller.js` usa `ReminderService` y el scheduler.
  - Arranque: `src/index.js` llama a `initReminderScheduler()` al levantar el servidor.

## Variables de Entorno

- `REMINDER_PROVIDER`: `notification` (InApp) | `smtp`.
- SMTP (solo si `REMINDER_PROVIDER=smtp`):
  - `SMTP_HOST` (ej. `smtp-relay.brevo.com`)
  - `SMTP_PORT` (por defecto `587`)
  - `SMTP_SECURE` (`true`|`false`)
  - `SMTP_USER`, `SMTP_PASS` (si requiere autenticación)
  - `SMTP_FROM` (por defecto `no-reply@uabc.edu`)

Si `nodemailer` no está disponible, el proveedor SMTP hace fallback y muestra una vista previa de email en consola.

## Configuración en BD

Clave: `recordatorios.configuracion` en la tabla `Configuracion`.
- Ejemplo de valor:
```json
{
  "activo": true,
  "frecuencia": "semanal", // diario | semanal | mensual
  "dia_semana": "lunes",
  "hora": "09:00",
  "destinatarios": "todos", // todos | pendientes
  "mensaje": "Recordatorio: Tiene actividades pendientes por completar..."
}
```

## Endpoints

Prefijo: `/api/v1/recordatorios` (protegidos con `verifyToken` y `checkAdmin`).

- `GET /configuracion`: obtiene la configuración actual.
- `PUT /configuracion`: actualiza la configuración y recarga el scheduler.
- `PATCH /toggle`: activa/desactiva y recarga el scheduler.
- `GET /destinatarios?tipo=todos|pendientes`: listado y conteo de destinatarios.
- `POST /enviar-manual`: envía de inmediato con el proveedor seleccionado.
- `POST /programar`: agenda un envío puntual.
  - Body: `{ fecha_ejecucion: ISOString, frecuencia, dia_semana, hora, destinatarios, mensaje }`
  - Respuesta: `{ id, fecha }`.
- `DELETE /:id`: cancela una ejecución puntual previamente creada.
- `GET /estadisticas`: métricas básicas de notificaciones de tipo `RECORDATORIO`.

## Flujo de Envío

- El controlador llama `ReminderService.sendReminder({ mensaje, destinatarios })`.
- El servicio obtiene los destinatarios (`User.activo = true`) y delega al proveedor.
- Proveedor `notification`: crea registros en `Notificacion` (`tipo: 'RECORDATORIO'`).
- Proveedor `smtp`: envía correos (o muestra preview en consola si falta `nodemailer`).
 

## Ejemplos de Uso (curl)

- Actualizar configuración:
```
curl -X PUT http://localhost:3001/api/v1/recordatorios/configuracion \
 -H "Authorization: Bearer <token>" \
 -H "Content-Type: application/json" \
 -d '{
   "activo": true,
   "frecuencia": "semanal",
   "dia_semana": "lunes",
   "hora": "09:00",
   "destinatarios": "todos",
   "mensaje": "Recordatorio: Tiene actividades pendientes por completar."
 }'
```

- Enviar manual:
```
curl -X POST http://localhost:3001/api/v1/recordatorios/enviar-manual \
 -H "Authorization: Bearer <token>" \
 -H "Content-Type: application/json" \
 -d '{ "mensaje": "Hola", "destinatarios": "todos" }'
```

- Programar puntual:
```
curl -X POST http://localhost:3001/api/v1/recordatorios/programar \
 -H "Authorization: Bearer <token>" \
 -H "Content-Type: application/json" \
 -d '{
   "fecha_ejecucion": "2025-10-30T15:30:00.000Z",
   "frecuencia": "semanal",
   "dia_semana": "lunes",
   "hora": "09:00",
   "destinatarios": "todos",
   "mensaje": "Recordatorio semanal"
 }'
```

## Activar SMTP (Brevo)

1. Configure variables de entorno:
```
REMINDER_PROVIDER=smtp
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<usuario_smtp_de_brevo>
SMTP_PASS=<clave_smtp_de_brevo>
SMTP_FROM=notificaciones@tu-dominio.com
```
2. Envíe un manual para validar:
```
curl -X POST http://localhost:3001/api/v1/recordatorios/enviar-manual \
 -H "Authorization: Bearer <token>" \
 -H "Content-Type: application/json" \
 -d '{ "mensaje": "Prueba SMTP", "destinatarios": "todos" }'
```

- Cancelar puntual:
```
curl -X DELETE http://localhost:3001/api/v1/recordatorios/<id> \
 -H "Authorization: Bearer <token>"
```

## Extender con un nuevo proveedor

1. Cree un archivo en `src/services/reminders/providers/` que implemente un método `send({ recipients, message, meta })`.
2. Agregue el caso en `providers/index.js` y seleccione por `REMINDER_PROVIDER`.
3. Configure variables de entorno necesarias para su proveedor.

## Consideraciones

- El filtro “pendientes” en `ReminderService.getRecipients('pendientes')` es un TODO y depende de la lógica de negocio (p. ej., usuarios con reportes pendientes).
- Si no hay `email` en usuarios y usa `smtp`, revise el dataset de usuarios.
- En producción, asegure credenciales SMTP y dominios autorizados.

---

Para más detalles, revise `backend/src/controllers/recordatorio.controller.js` y `backend/src/index.js` donde se integran el servicio y el scheduler.