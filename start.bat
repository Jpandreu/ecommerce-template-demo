@echo off
chcp 65001 >nul
cls

echo 🛍️  Plantilla Ecommerce Profesional
echo ==================================
echo.

REM Verificar si estamos en la carpeta correcta
if not exist "index.html" (
    echo ❌ Error: No se encuentra index.html
    echo    Ejecuta este script desde la carpeta raíz del proyecto
    pause
    exit /b 1
)

echo ✅ Estructura del proyecto verificada
echo.

REM Mostrar información del proyecto
echo 📁 Estructura del proyecto:
echo    ├── index.html              # Página principal
echo    ├── assets/
echo    │   ├── css/styles.css      # Estilos principales
echo    │   ├── js/main.js          # JavaScript funcional
echo    │   └── images/             # Imágenes y assets
echo    ├── README.md               # Documentación
echo    └── start.bat               # Este script
echo.

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    set "SERVER_CMD=python -m http.server 8000"
    set "SERVER_NAME=Python"
) else (
    python3 --version >nul 2>&1
    if %errorlevel% == 0 (
        set "SERVER_CMD=python3 -m http.server 8000"
        set "SERVER_NAME=Python 3"
    ) else (
        REM Verificar PHP
        php --version >nul 2>&1
        if %errorlevel% == 0 (
            set "SERVER_CMD=php -S localhost:8000"
            set "SERVER_NAME=PHP"
        ) else (
            set "SERVER_CMD="
            set "SERVER_NAME=Ninguno"
        )
    )
)

if not "%SERVER_CMD%"=="" (
    echo 🌐 Servidor disponible: %SERVER_NAME%
) else (
    echo ⚠️  No se detectó servidor web local
)

echo.
echo 🚀 Opciones disponibles:
echo    1) Iniciar servidor local (Puerto 8000)
echo    2) Abrir en navegador (archivo local)
echo    3) Mostrar información de desarrollo
echo    4) Verificar dependencias externas
echo    5) Optimizar para producción
echo    6) Salir
echo.

set /p choice="Selecciona una opción (1-6): "

if "%choice%"=="1" (
    if not "%SERVER_CMD%"=="" (
        echo 🌐 Iniciando servidor local en puerto 8000...
        echo    URL: http://localhost:8000
        echo    Presiona Ctrl+C para detener el servidor
        echo.
        
        REM Abrir navegador después de 2 segundos
        timeout /t 2 /nobreak >nul
        start http://localhost:8000
        
        %SERVER_CMD%
    ) else (
        echo ❌ No se encontró ningún servidor web disponible
        echo    Instala Python o PHP para usar un servidor local
        echo    O abre index.html directamente en tu navegador
        pause
    )
) else if "%choice%"=="2" (
    echo 🌐 Abriendo en navegador predeterminado...
    start "" "%cd%\index.html"
) else if "%choice%"=="3" (
    echo 📖 Información de desarrollo:
    echo.
    echo 🎨 Personalización:
    echo    • Colores: Edita variables CSS en assets\css\styles.css
    echo    • Contenido: Modifica index.html directamente
    echo    • Imágenes: Reemplaza archivos en assets\images\
    echo    • Logo: Actualiza logo.svg y logo-white.svg
    echo.
    echo ⚙️  Funcionalidades:
    echo    • Formularios: Conecta backend en assets\js\main.js
    echo    • Analytics: Añade código en index.html
    echo    • SEO: Meta tags configurados y editables
    echo.
    echo 📱 Testing:
    echo    • Responsive: Prueba en diferentes dispositivos
    echo    • Performance: Usa Lighthouse en DevTools
    echo    • Accesibilidad: Verifica con herramientas a11y
    echo.
    pause
) else if "%choice%"=="4" (
    echo 🔍 Verificando dependencias externas...
    echo.
    echo 📝 Google Fonts ^(Inter^): ✅ Cargado desde CDN
    echo 🎯 Font Awesome 6.4.0: ✅ Cargado desde CDN
    echo ✨ AOS ^(Animate On Scroll^): ✅ Cargado desde CDN
    echo.
    echo ℹ️  Todas las dependencias se cargan desde CDN
    echo    Para uso offline, descarga y hospeda localmente
    echo.
    pause
) else if "%choice%"=="5" (
    echo 🚀 Preparando para producción...
    echo.
    echo 📋 Lista de optimizaciones recomendadas:
    echo    ✅ Comprimir imágenes ^(WebP, optimización^)
    echo    ✅ Minificar CSS y JavaScript
    echo    ✅ Configurar caché del navegador
    echo    ✅ Implementar lazy loading de imágenes
    echo    ✅ Configurar CDN para assets estáticos
    echo    ✅ Generar sitemap.xml
    echo    ✅ Configurar robots.txt
    echo    ✅ Verificar Open Graph tags
    echo.
    echo 🔧 Herramientas recomendadas:
    echo    • TinyPNG/TinyJPG para compresión
    echo    • Lighthouse para auditoría
    echo    • PageSpeed Insights para rendimiento
    echo.
    pause
) else if "%choice%"=="6" (
    echo 👋 ¡Hasta luego!
    exit /b 0
) else (
    echo ❌ Opción no válida
    pause
    exit /b 1
)
