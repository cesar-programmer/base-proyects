# Frontend — Sistema de Reportes Académicos

## Configuración

- Copia `.env.example` a `.env` y ajusta:

```
VITE_API_URL=http://localhost:3001/api/v1
```

En producción establece `VITE_API_URL` al dominio de la API.

## Desarrollo

- `npm install`
- `npm run dev`

## Build de producción

- `npm run build`
- El build copia los archivos de `public/` a la raíz (favicon, etc.).

## Logs

- En desarrollo, los `console.*` funcionan con normalidad.
- En producción, se silencian `console.log/debug/trace/table/group/time` automáticamente; se mantienen `console.warn/error`.
