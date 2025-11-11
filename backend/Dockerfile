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

# Copiar el script de entrypoint y convertir finales de línea
COPY ./scripts/docker-entrypoint.sh /tmp/docker-entrypoint.sh
RUN sed -i 's/\r$//' /tmp/docker-entrypoint.sh && \
    mv /tmp/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Copiar el resto del código fuente
COPY . .

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
    SMTP_HOST= \
    SMTP_PORT=587 \
    SMTP_SECURE=false \
    SMTP_USER= \
    SMTP_PASS= \
    SMTP_FROM=no-reply@uabc.edu \
    SMTP_DEBUG=false \
    GMAIL_USER= \
    GMAIL_CLIENT_ID= \
    SMTP_GMAIL_CLIENT_ID= \
    GMAIL_CLIENT_SECRET= \
    GMAIL_REFRESH_TOKEN=

# Rate Limiting - Valores optimizados para demos (10,000 peticiones cada 5 min)
ENV AUTH_RATE_LIMIT_WINDOW_MS=300000 \
    AUTH_RATE_LIMIT_MAX=10000 \
    GENERAL_RATE_LIMIT_WINDOW_MS=300000 \
    GENERAL_RATE_LIMIT_MAX=10000

# Exponer el puerto de la API
EXPOSE 3000

# Comando para iniciar en producción (migraciones + seeders + app)
ENTRYPOINT ["docker-entrypoint.sh"]
