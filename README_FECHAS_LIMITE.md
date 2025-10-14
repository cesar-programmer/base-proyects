# Configuración de Fechas Límite

Este documento explica cómo funciona la configuración y uso de fechas límite en el sistema, ahora simplificado a dos categorías: `REGISTRO` y `ENTREGA`. Incluye reglas de negocio, flujo en la interfaz, y ejemplos de uso vía API.

## Visión general

- Las fechas límite viven dentro de un Período Académico. Solo el período activo afecta validaciones.
- Se permiten múltiples fechas por categoría dentro del período activo; para validaciones se usa la más tardía que esté activa.
- Categorías soportadas:
  - `REGISTRO`: controla la ventana de registro y edición de actividades.
  - `ENTREGA`: controla el envío de reportes por parte de docentes.

## Reglas de negocio

- Actividades usan la fecha límite activa de categoría `REGISTRO` del período académico activo.
- Reportes usan la fecha límite activa de categoría `ENTREGA` del período académico activo.
- Si hay varias fechas activas de la misma categoría dentro del período activo, se selecciona la más tardía para el bloqueo/permiso.
- La interfaz permite activar/desactivar fechas; solo las activas influyen en validaciones.
- Los administradores pueden cambiar el estado de reportes sin restricción por fecha (endpoint administrativo).

## Flujo en la interfaz (Administración)

- Pantalla: Configuración de Fechas Límite (Dashboard de Admin).
- Acciones disponibles:
  - Crear, editar, eliminar fechas límite.
  - Activar/desactivar una fecha.
  - Elegir `Período Académico` y `Categoría` (solo `REGISTRO` y `ENTREGA`).
  - Definir `fecha_limite`, `dias_recordatorio`, `nombre`, `descripcion`.
- Visualiza estados: activo, inactivo, vencido, próximo, y resumen por categoría.

## Endpoints API (autenticados)

Base de los servicios de fechas límite:

- `GET /fechas-limite` — lista y permite filtros (`categoria`, `id_periodo`, `activo`).
- `GET /fechas-limite/proximas?dias=7` — próximas fechas activas a vencer.
- `GET /fechas-limite/:id` — detalle.
- `POST /fechas-limite` — crear (valida `categoria` ∈ {`REGISTRO`, `ENTREGA`}).
- `PUT /fechas-limite/:id` — actualizar (misma validación y campos).
- `PATCH /fechas-limite/:id/toggle` — activar/desactivar.
- `DELETE /fechas-limite/:id` — eliminar.

Endpoints relacionados con reportes:

- `GET /reportes/deadline/info` — devuelve información del semestre y la fecha `ENTREGA` más próxima relevante al período activo.
- `PATCH /reportes/:id/enviar` — docente envía su reporte; respeta la ventana `ENTREGA` salvo bypass administrativo.
- `PATCH /reportes/:id/status` — administrador cambia estado (`estado`, `observaciones_admin`).

## Cuerpo de ejemplo para fechas límite

Campos comunes:

```json
{
  "nombre": "Cierre Registro Actividades",
  "descripcion": "Fin de registro de actividades del semestre 2024-2",
  "fecha_limite": "2025-11-30T23:59:59.000Z",
  "categoria": "REGISTRO",
  "id_periodo": 3,
  "semestre": "2024-2",
  "dias_recordatorio": 7,
  "activo": true
}
```

## Ejemplos de uso (curl)

1) Crear fecha límite `REGISTRO`:

```bash
curl -X POST "https://<tu-backend>/fechas-limite" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Registro Actividades 2024-2",
    "descripcion": "Cierra el registro del semestre 2024-2",
    "fecha_limite": "2025-11-30T23:59:59.000Z",
    "categoria": "REGISTRO",
    "id_periodo": 3,
    "semestre": "2024-2",
    "dias_recordatorio": 7,
    "activo": true
  }'
```

2) Crear fecha límite `ENTREGA`:

```bash
curl -X POST "https://<tu-backend>/fechas-limite" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Entrega de Reportes 2024-2",
    "descripcion": "Fecha de entrega de reportes",
    "fecha_limite": "2025-12-15T23:59:59.000Z",
    "categoria": "ENTREGA",
    "id_periodo": 3,
    "semestre": "2024-2",
    "dias_recordatorio": 5,
    "activo": true
  }'
```

3) Activar/Desactivar una fecha límite:

```bash
curl -X PATCH "https://<tu-backend>/fechas-limite/42/toggle" \
  -H "Authorization: Bearer <TOKEN>"
```

4) Consultar próximas fechas activas a vencer en 10 días:

```bash
curl -X GET "https://<tu-backend>/fechas-limite/proximas?dias=10" \
  -H "Authorization: Bearer <TOKEN>"
```

5) Docente envía un reporte (valida `ENTREGA`):

```bash
curl -X PATCH "https://<tu-backend>/reportes/123/enviar" \
  -H "Authorization: Bearer <TOKEN_DOCENTE>"
```

6) Administrador cambia estado de un reporte (sin restricción por fecha):

```bash
curl -X PATCH "https://<tu-backend>/reportes/123/status" \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "APROBADO",
    "observaciones_admin": "Cumple criterios."
  }'
```

## Buenas prácticas

- Mantener una única fecha activa por categoría y período para evitar confusiones.
- Usar `dias_recordatorio` para notificaciones anticipadas.
- Al editar, comunicar cambios críticos a docentes y responsables.

## Notas técnicas

- Validación de `categoria` en el backend: solo `REGISTRO` y `ENTREGA`.
- El endpoint `deadline/info` calcula la fecha `ENTREGA` más cercana relevante al período activo.
- La UI de administración ya restringe la selección de categoría a estas dos.