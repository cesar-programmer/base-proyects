#!/bin/sh
set -e

echo "[entrypoint] NODE_ENV=${NODE_ENV} DB_HOST=${DB_HOST} DB_NAME=${DB_NAME}"
echo "[entrypoint] Directorio actual: $(pwd)"

# Verificar que .sequelizerc existe
if [ ! -f ".sequelizerc" ]; then
  echo "[entrypoint] ERROR: .sequelizerc no encontrado en $(pwd)"
  exit 1
fi

echo "[entrypoint] .sequelizerc encontrado ✓"

# Verificar estructura de directorios
if [ ! -d "src/db/migrations" ]; then
  echo "[entrypoint] ERROR: src/db/migrations no existe"
  exit 1
fi

if [ ! -d "src/db/seeders" ]; then
  echo "[entrypoint] ERROR: src/db/seeders no existe"
  exit 1
fi

echo "[entrypoint] Estructura de directorios verificada ✓"

RUN_MIGRATIONS=${RUN_MIGRATIONS:-true}
RUN_SEEDERS=${RUN_SEEDERS:-true}

echo "[entrypoint] Esperando a que la base de datos esté lista en $DB_HOST:$DB_PORT..."
# Loop de espera simple usando Node.js para portabilidad
# Intenta conectar cada 2 segundos, máximo 30 intentos (60s)
for i in $(seq 1 30); do
  if node -e "const net = require('net'); const client = new net.Socket(); client.connect($DB_PORT, '$DB_HOST', () => { process.exit(0); }); client.on('error', () => { process.exit(1); });" 2>/dev/null; then
    echo "[entrypoint] Conexión exitosa a la base de datos ✓"
    break
  else
    echo "[entrypoint] Esperando base de datos... ($i/30)"
    sleep 2
  fi
  
  if [ "$i" = "30" ]; then
    echo "[entrypoint] ERROR: No se pudo conectar a la base de datos después de 60 segundos"
    exit 1
  fi
done

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "[entrypoint] Ejecutando migraciones..."
  # Usar npx sequelize-cli con la configuración explícita
  npx sequelize-cli db:migrate --config src/db/config.cjs || {
    echo "[entrypoint] ERROR: Falló la ejecución de migraciones"
    exit 1
  }
  echo "[entrypoint] Migraciones completadas ✓"
else
  echo "[entrypoint] RUN_MIGRATIONS=false, omitiendo migraciones"
fi

if [ "$RUN_SEEDERS" = "true" ]; then
  echo "[entrypoint] Ejecutando seeders..."
  # Usar npx sequelize-cli con la configuración explícita
  npx sequelize-cli db:seed:all --config src/db/config.cjs || {
    echo "[entrypoint] ERROR: Falló la ejecución de seeders"
    exit 1
  }
  echo "[entrypoint] Seeders completados ✓"
else
  echo "[entrypoint] RUN_SEEDERS=false, omitiendo seeders"
fi

echo "[entrypoint] Iniciando aplicación Node..."
exec node src/index.js

