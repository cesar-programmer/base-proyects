# Guía de Despliegue (Docker Compose)

Esta guía explica cómo levantar el sistema en modo producción usando Docker y docker compose. No modifica la lógica de la aplicación; sólo orquesta imágenes y variables de entorno.

## Requisitos
- Docker 24+ y Docker Compose Plugin
- Puertos libres: `8082` (frontend), `3000` (backend)

## 1) Variables de entorno

- Backend: copia el archivo de ejemplo y edítalo

```
cp backend/.env.example backend/.env
```

Ajusta al menos estas variables en `backend/.env`:
- `JWT_SECRET`: secreto fuerte para JWT
- `DB_PASSWORD`: contraseña segura para MySQL
- `FRONTEND_URL`: URL pública del frontend (por ejemplo `http://localhost:8080` o `https://mi-dominio.com`)
- (Opcional) `CORS_ORIGINS`: lista separada por comas de orígenes permitidos (si se define, tiene prioridad)
- (Opcional) límites de rate limiting `*_RATE_LIMIT_*`

- Frontend: la variable `VITE_API_URL` se inyecta en build desde `docker-compose.prod.yml`.
  - Por defecto apunta a `http://localhost:3000/api/v1` accesible desde el navegador.
  - Para exponer una API pública, edita `docker-compose.prod.yml` y cambia el build arg `VITE_API_URL` a tu dominio, por ejemplo:

```
# docker-compose.prod.yml
frontend:
  build:
    context: ./frontend
    target: production
    args:
      VITE_API_URL: https://api.mi-dominio.com/api/v1
```

Si construyes el frontend fuera de Compose, puedes usar `frontend/.env` (ver `frontend/.env.example`).

## 2) Construir e iniciar

- Construir imágenes de frontend y backend (producción):

```
docker compose -f docker-compose.prod.yml build --no-cache
```

- Levantar contenedores en segundo plano:

```
docker compose -f docker-compose.prod.yml up -d
```

## 3) Verificar

- Backend (debe responder JSON):

```
curl http://localhost:3000/health
```

- Frontend: abre en el navegador

```
http://localhost:8082
```

Si usas dominios, sustitúyelos en `FRONTEND_URL`, `CORS_ORIGINS` y `VITE_API_URL` según corresponda.

## 4) Logs y estado

- Ver logs del backend:

```
docker compose -f docker-compose.prod.yml logs -f backend
```

- Ver logs del frontend (Nginx):

```
docker compose -f docker-compose.prod.yml logs -f frontend

- Migraciones y seeders (automático):
  - El backend ejecuta `sequelize db:migrate` y `sequelize db:seed:all` al iniciar.
  - Controlar con variables:
    - `RUN_MIGRATIONS=true|false`
    - `RUN_SEEDERS=true|false`
```

- Estado general:

```
docker compose -f docker-compose.prod.yml ps
```

## 5) Apagar y limpiar

- Detener y eliminar contenedores (mantiene el volumen de MySQL):

```
docker compose -f docker-compose.prod.yml down
```

- (Opcional) eliminar volumen de datos de MySQL:

```
docker volume rm base-proyects_mysql_data || true
```

## Notas importantes
- CORS y orígenes: en producción se permite por defecto sólo `FRONTEND_URL`. Define `CORS_ORIGINS` si necesitas múltiples dominios.
- VITE_API_URL: cualquier cambio requiere reconstruir el frontend (`build`) porque Vite lo embebe en tiempo de build.
- Seguridad: define `JWT_SECRET` y `DB_PASSWORD` con valores seguros. Evita credenciales por defecto.
- Puppeteer: la imagen de backend ya incluye librerías del sistema necesarias para generar PDFs.
- Persistencia: los datos de MySQL persisten en el volumen `mysql_data` del compose de producción.

## Solución de problemas
- 403 CORS en el navegador: verifica `FRONTEND_URL`/`CORS_ORIGINS` en backend y que el navegador apunte al dominio/puerto correcto.
- El frontend carga pero no muestra datos: confirma que `VITE_API_URL` apunte al backend y que el backend responda en `/api/v1`.
- Error de conexión a DB: revisa `backend/.env` (DB_HOST/USER/PASSWORD/NAME) y `docker compose ps` para el estado de MySQL.
- Cambié variables y no se reflejan: reconstruye imágenes (`build`) y reinicia (`up -d`).

## Producción detrás de proxy (opcional)
Si vas a poner Nginx/Traefik delante, mapea dominios y TLS en el proxy y ajusta:
- `FRONTEND_URL` en el backend
- `VITE_API_URL` para que apunte al dominio público de la API
- `CORS_ORIGINS` si hay múltiples frontends

---

Checklist rápido:
- [ ] `backend/.env` creado y con secretos definidos
- [ ] `VITE_API_URL` correcto en `docker-compose.prod.yml`
- [ ] `docker compose -f docker-compose.prod.yml build && up -d`
- [ ] `curl http://localhost:3000/health` OK y frontend accesible en `http://localhost:8080`
