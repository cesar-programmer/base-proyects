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

