# Etapa de desarrollo
FROM node:18-alpine AS development

WORKDIR /app

# Instalar dependencias de desarrollo
COPY package*.json ./
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer el puerto de la API
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=development

# Comando para iniciar en desarrollo
CMD ["npm", "run", "dev"]

# Etapa de producción
FROM node:18-bullseye-slim AS production

WORKDIR /app

# Instalar solo las dependencias de producción
COPY package*.json ./
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
 && rm -rf /var/lib/apt/lists/* \
 && npm ci --only=production \
 && npm install -g sequelize-cli

# Copiar el resto del código fuente
COPY . .
COPY ./scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Configurar variables de entorno (valores por defecto seguros/placeholder)
ENV NODE_ENV=production \
    PORT=3000 \
    DB_HOST=localhost \
    DB_PORT=3306 \
    DB_USER=user \
    DB_PASSWORD= \
    DB_NAME=reportesdb \
    JWT_SECRET= \
    JWT_EXPIRES_IN=24h \
    FRONTEND_URL= \
    CORS_ORIGINS= \
    AUTH_RATE_LIMIT_WINDOW_MS=900000 \
    AUTH_RATE_LIMIT_MAX=5 \
    GENERAL_RATE_LIMIT_WINDOW_MS=900000 \
    GENERAL_RATE_LIMIT_MAX=300 \
    SMTP_HOST= \
    SMTP_PORT=587 \
    SMTP_SECURE=false \
    SMTP_USER= \
    SMTP_PASS= \
    SMTP_FROM=no-reply@uabc.edu \
    SMTP_DEBUG=false \
    GMAIL_USER= \
    GMAIL_CLIENT_ID= \
    GMAIL_CLIENT_SECRET= \
    GMAIL_REFRESH_TOKEN=

# Exponer el puerto de la API
EXPOSE 3000

# Comando para iniciar en producción (migraciones + seeders + app)
CMD ["./docker-entrypoint.sh"]
