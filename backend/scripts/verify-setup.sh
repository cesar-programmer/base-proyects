#!/bin/bash

# Script de verificación de configuración del proyecto
# Ejecuta este script para diagnosticar problemas con migrations/seeders

echo "=========================================="
echo "🔍 DIAGNÓSTICO DEL PROYECTO"
echo "=========================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

# 1. Verificar directorio actual
echo "1️⃣  Verificando directorio actual..."
if [ -f "package.json" ] && grep -q "\"name\".*backend" package.json 2>/dev/null; then
  check "Estás en el directorio backend"
else
  echo -e "${RED}✗${NC} No estás en el directorio backend"
  echo "   Ejecuta: cd backend"
  exit 1
fi
echo ""

# 2. Verificar archivo .sequelizerc
echo "2️⃣  Verificando .sequelizerc..."
if [ -f ".sequelizerc" ]; then
  check ".sequelizerc existe"
  echo "   Contenido:"
  cat .sequelizerc | head -n 10
else
  echo -e "${RED}✗${NC} .sequelizerc NO existe"
  echo "   Este archivo es necesario para que Sequelize encuentre las rutas"
fi
echo ""

# 3. Verificar estructura de directorios
echo "3️⃣  Verificando estructura de directorios..."
ERRORS=0

if [ -d "src/db" ]; then
  check "src/db/ existe"
else
  echo -e "${RED}✗${NC} src/db/ NO existe"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "src/db/config.cjs" ]; then
  check "src/db/config.cjs existe"
else
  echo -e "${RED}✗${NC} src/db/config.cjs NO existe"
  ERRORS=$((ERRORS + 1))
fi

if [ -d "src/db/models" ]; then
  check "src/db/models/ existe"
else
  echo -e "${RED}✗${NC} src/db/models/ NO existe"
  ERRORS=$((ERRORS + 1))
fi

if [ -d "src/db/migrations" ]; then
  check "src/db/migrations/ existe"
  MIGRATION_COUNT=$(ls -1 src/db/migrations/*.js 2>/dev/null | wc -l)
  echo "   → Archivos de migración encontrados: $MIGRATION_COUNT"
else
  echo -e "${RED}✗${NC} src/db/migrations/ NO existe"
  ERRORS=$((ERRORS + 1))
fi

if [ -d "src/db/seeders" ]; then
  check "src/db/seeders/ existe"
  SEEDER_COUNT=$(ls -1 src/db/seeders/*.js 2>/dev/null | wc -l)
  echo "   → Archivos de seeder encontrados: $SEEDER_COUNT"
else
  echo -e "${RED}✗${NC} src/db/seeders/ NO existe"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Verificar Node.js y npm
echo "4️⃣  Verificando versiones..."
echo "   Node.js: $(node --version 2>/dev/null || echo 'NO INSTALADO')"
echo "   npm: $(npm --version 2>/dev/null || echo 'NO INSTALADO')"
echo ""

# 5. Verificar dependencias instaladas
echo "5️⃣  Verificando dependencias..."
if [ -d "node_modules" ]; then
  check "node_modules/ existe"
  
  if [ -d "node_modules/sequelize" ]; then
    check "sequelize está instalado"
  else
    echo -e "${RED}✗${NC} sequelize NO está instalado"
    echo "   Ejecuta: npm install"
  fi
  
  if [ -d "node_modules/sequelize-cli" ]; then
    check "sequelize-cli está instalado"
  else
    echo -e "${RED}✗${NC} sequelize-cli NO está instalado"
    echo "   Ejecuta: npm install"
  fi
else
  echo -e "${RED}✗${NC} node_modules/ NO existe"
  echo "   Ejecuta: npm install"
fi
echo ""

# 6. Verificar sequelize-cli
echo "6️⃣  Verificando sequelize-cli..."
if command -v npx >/dev/null 2>&1; then
  check "npx está disponible"
  
  if npx sequelize-cli --version >/dev/null 2>&1; then
    SEQUELIZE_VERSION=$(npx sequelize-cli --version 2>/dev/null)
    check "sequelize-cli funciona correctamente"
    echo "   Versión: $SEQUELIZE_VERSION"
  else
    echo -e "${RED}✗${NC} sequelize-cli NO funciona"
  fi
else
  echo -e "${RED}✗${NC} npx NO está disponible"
fi
echo ""

# 7. Verificar archivo .env
echo "7️⃣  Verificando variables de entorno..."
if [ -f ".env" ]; then
  check ".env existe"
  echo "   Variables configuradas:"
  grep -E "^(DB_|NODE_ENV|PORT)" .env 2>/dev/null || echo "   (Ninguna variable DB_ encontrada)"
else
  echo -e "${YELLOW}⚠${NC}  .env NO existe (opcional si usas Docker)"
fi
echo ""

# 8. Verificar conexión a MySQL (si está disponible)
echo "8️⃣  Verificando conexión a MySQL..."
if command -v mysql >/dev/null 2>&1; then
  check "mysql CLI está disponible"
  
  # Intentar conectar (esto puede fallar si no está configurado)
  echo "   Intentando conectar a MySQL..."
  mysql -h localhost -u user -ppassword -e "SELECT 1" 2>/dev/null
  if [ $? -eq 0 ]; then
    check "Conexión a MySQL exitosa"
  else
    echo -e "${YELLOW}⚠${NC}  No se pudo conectar a MySQL (puede estar bien si usas Docker)"
  fi
else
  echo -e "${YELLOW}⚠${NC}  mysql CLI no disponible (normal si usas Docker)"
fi
echo ""

# Resumen
echo "=========================================="
echo "📊 RESUMEN"
echo "=========================================="

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ Todo parece estar configurado correctamente${NC}"
  echo ""
  echo "Puedes intentar ejecutar:"
  echo "  npm run db:migrate"
  echo "  npm run db:seed"
  echo ""
else
  echo -e "${RED}✗ Se encontraron $ERRORS errores en la configuración${NC}"
  echo ""
  echo "Pasos sugeridos:"
  echo "  1. Asegúrate de estar en la carpeta 'backend'"
  echo "  2. Ejecuta: npm install"
  echo "  3. Verifica que existe el archivo .sequelizerc"
  echo "  4. Verifica la estructura de directorios src/db/"
  echo "  5. Consulta TROUBLESHOOTING.md para más ayuda"
  echo ""
fi

echo "Para más información, consulta: TROUBLESHOOTING.md"
echo "=========================================="
