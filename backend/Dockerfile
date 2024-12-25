# Etapa de desarrollo
FROM node:18-alpine as development

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
FROM node:18-alpine as production

WORKDIR /app

# Instalar solo las dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar el resto del código fuente
COPY . .

# Configurar variables de entorno
ENV NODE_ENV=production \
    PORT=3000

# Exponer el puerto de la API
EXPOSE 3000

# Comando para iniciar en producción
CMD ["node", "index.js"]
