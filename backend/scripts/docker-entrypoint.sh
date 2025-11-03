#!/bin/sh
set -e

echo "[entrypoint] NODE_ENV=${NODE_ENV} DB_HOST=${DB_HOST} DB_NAME=${DB_NAME}"

# Instalar sequelize-cli global si no existe
if ! command -v sequelize >/dev/null 2>&1; then
  echo "[entrypoint] sequelize-cli no encontrado; instalando globalmente..."
  npm install -g sequelize-cli >/dev/null 2>&1 || true
fi

RUN_MIGRATIONS=${RUN_MIGRATIONS:-true}
RUN_SEEDERS=${RUN_SEEDERS:-true}

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "[entrypoint] Ejecutando migraciones..."
  if command -v sequelize >/dev/null 2>&1; then
    sequelize db:migrate || exit 1
  else
    npx sequelize-cli db:migrate || exit 1
  fi
else
  echo "[entrypoint] RUN_MIGRATIONS=false, omitiendo migraciones"
fi

if [ "$RUN_SEEDERS" = "true" ]; then
  echo "[entrypoint] Ejecutando seeders..."
  if command -v sequelize >/dev/null 2>&1; then
    sequelize db:seed:all || exit 1
  else
    npx sequelize-cli db:seed:all || exit 1
  fi
else
  echo "[entrypoint] RUN_SEEDERS=false, omitiendo seeders"
fi

echo "[entrypoint] Iniciando aplicación Node..."
exec node src/index.js

