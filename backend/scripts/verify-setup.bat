@echo off
REM Script de verificación para Windows
REM Ejecuta este script para diagnosticar problemas con migrations/seeders

echo ==========================================
echo DIAGNOSTICO DEL PROYECTO
echo ==========================================
echo.

REM 1. Verificar directorio actual
echo 1. Verificando directorio actual...
if exist "package.json" (
    findstr /C:"backend" package.json >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Estas en el directorio backend
    ) else (
        echo [ERROR] No estas en el directorio backend
        echo    Ejecuta: cd backend
        exit /b 1
    )
) else (
    echo [ERROR] package.json no encontrado
    echo    Ejecuta: cd backend
    exit /b 1
)
echo.

REM 2. Verificar archivo .sequelizerc
echo 2. Verificando .sequelizerc...
if exist ".sequelizerc" (
    echo [OK] .sequelizerc existe
    type .sequelizerc
) else (
    echo [ERROR] .sequelizerc NO existe
    echo    Este archivo es necesario para que Sequelize encuentre las rutas
)
echo.

REM 3. Verificar estructura de directorios
echo 3. Verificando estructura de directorios...

if exist "src\db" (
    echo [OK] src\db\ existe
) else (
    echo [ERROR] src\db\ NO existe
)

if exist "src\db\config.cjs" (
    echo [OK] src\db\config.cjs existe
) else (
    echo [ERROR] src\db\config.cjs NO existe
)

if exist "src\db\models" (
    echo [OK] src\db\models\ existe
) else (
    echo [ERROR] src\db\models\ NO existe
)

if exist "src\db\migrations" (
    echo [OK] src\db\migrations\ existe
    dir /B src\db\migrations\*.js 2>nul | find /C ".js" > temp_count.txt
    set /p MIGRATION_COUNT=<temp_count.txt
    del temp_count.txt
    echo    - Archivos de migracion encontrados: %MIGRATION_COUNT%
) else (
    echo [ERROR] src\db\migrations\ NO existe
)

if exist "src\db\seeders" (
    echo [OK] src\db\seeders\ existe
    dir /B src\db\seeders\*.js 2>nul | find /C ".js" > temp_count.txt
    set /p SEEDER_COUNT=<temp_count.txt
    del temp_count.txt
    echo    - Archivos de seeder encontrados: %SEEDER_COUNT%
) else (
    echo [ERROR] src\db\seeders\ NO existe
)
echo.

REM 4. Verificar Node.js y npm
echo 4. Verificando versiones...
node --version 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js: 
    node --version
) else (
    echo [ERROR] Node.js NO instalado
)

npm --version 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm: 
    npm --version
) else (
    echo [ERROR] npm NO instalado
)
echo.

REM 5. Verificar dependencias instaladas
echo 5. Verificando dependencias...
if exist "node_modules" (
    echo [OK] node_modules\ existe
    
    if exist "node_modules\sequelize" (
        echo [OK] sequelize esta instalado
    ) else (
        echo [ERROR] sequelize NO esta instalado
        echo    Ejecuta: npm install
    )
    
    if exist "node_modules\sequelize-cli" (
        echo [OK] sequelize-cli esta instalado
    ) else (
        echo [ERROR] sequelize-cli NO esta instalado
        echo    Ejecuta: npm install
    )
) else (
    echo [ERROR] node_modules\ NO existe
    echo    Ejecuta: npm install
)
echo.

REM 6. Verificar sequelize-cli
echo 6. Verificando sequelize-cli...
npx sequelize-cli --version 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] sequelize-cli funciona correctamente
    npx sequelize-cli --version
) else (
    echo [ERROR] sequelize-cli NO funciona
    echo    Ejecuta: npm install
)
echo.

REM 7. Verificar archivo .env
echo 7. Verificando variables de entorno...
if exist ".env" (
    echo [OK] .env existe
    echo    Variables configuradas:
    findstr /B "DB_" .env 2>nul
    findstr /B "NODE_ENV" .env 2>nul
    findstr /B "PORT" .env 2>nul
) else (
    echo [ADVERTENCIA] .env NO existe (opcional si usas Docker)
)
echo.

REM Resumen
echo ==========================================
echo RESUMEN
echo ==========================================
echo.
echo Si todo esta en verde [OK], puedes ejecutar:
echo   npm run db:migrate
echo   npm run db:seed
echo.
echo Si hay errores [ERROR], sigue estos pasos:
echo   1. Asegurate de estar en la carpeta 'backend'
echo   2. Ejecuta: npm install
echo   3. Verifica que existe el archivo .sequelizerc
echo   4. Verifica la estructura de directorios src\db\
echo   5. Consulta TROUBLESHOOTING.md para mas ayuda
echo.
echo Para mas informacion, consulta: TROUBLESHOOTING.md
echo ==========================================
echo.

pause
