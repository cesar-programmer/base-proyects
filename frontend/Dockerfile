# Etapa de desarrollo
FROM node:18-alpine as development

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
FROM node:18-alpine as build

WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias con npm ci para una instalación limpia
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine as production

WORKDIR /usr/share/nginx/html

# Copiar los archivos estáticos desde la etapa de construcción
COPY --from=build /app/dist .

# Exponer el puerto estándar de Nginx
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
