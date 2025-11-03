# Etapa de desarrollo
FROM node:18-alpine AS development

WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias de desarrollo
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto que usa Vite por defecto
EXPOSE 5173

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]

# Etapa de construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias con npm ci para una instalación limpia
RUN npm ci

# Inyectar VITE_* en tiempo de build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine AS production

WORKDIR /usr/share/nginx/html

# Copiar los archivos estáticos desde la etapa de construcción
COPY --from=build /app/dist .

# Configuración de Nginx (SPA fallback, cache estática)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto estándar de Nginx
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
