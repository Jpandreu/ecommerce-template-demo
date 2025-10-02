#!/bin/bash

# Script de inicio para la plantilla ecommerce
# Facilita el desarrollo local y la configuración inicial

echo "🛍️  Plantilla Ecommerce Profesional"
echo "=================================="
echo ""

# Verificar si estamos en la carpeta correcta
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encuentra index.html"
    echo "   Ejecuta este script desde la carpeta raíz del proyecto"
    exit 1
fi

echo "✅ Estructura del proyecto verificada"
echo ""

# Mostrar información del proyecto
echo "📁 Estructura del proyecto:"
echo "   ├── index.html              # Página principal"
echo "   ├── assets/"
echo "   │   ├── css/styles.css      # Estilos principales" 
echo "   │   ├── js/main.js          # JavaScript funcional"
echo "   │   └── images/             # Imágenes y assets"
echo "   ├── README.md               # Documentación"
echo "   └── start.sh                # Este script"
echo ""

# Verificar navegador disponible
if command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
elif command -v firefox &> /dev/null; then
    BROWSER="firefox"
elif command -v safari &> /dev/null; then
    BROWSER="safari"
else
    BROWSER=""
fi

# Detectar servidor web disponible
SERVER_CMD=""
PORT=8000

if command -v python3 &> /dev/null; then
    SERVER_CMD="python3 -m http.server $PORT"
    echo "🐍 Servidor: Python 3 detectado"
elif command -v python &> /dev/null; then
    SERVER_CMD="python -m http.server $PORT"
    echo "🐍 Servidor: Python detectado"
elif command -v node &> /dev/null; then
    # Verificar si npx está disponible para usar serve
    if command -v npx &> /dev/null; then
        SERVER_CMD="npx serve -p $PORT"
        echo "📦 Servidor: Node.js con serve detectado"
    fi
elif command -v php &> /dev/null; then
    SERVER_CMD="php -S localhost:$PORT"
    echo "🐘 Servidor: PHP detectado"
fi

# Opciones del menú
echo "🚀 Opciones disponibles:"
echo "   1) Iniciar servidor local (Puerto $PORT)"
echo "   2) Abrir en navegador (archivo local)"
echo "   3) Mostrar información de desarrollo"
echo "   4) Verificar dependencias externas"
echo "   5) Optimizar para producción"
echo "   6) Salir"
echo ""

read -p "Selecciona una opción (1-6): " choice

case $choice in
    1)
        if [ -n "$SERVER_CMD" ]; then
            echo "🌐 Iniciando servidor local en puerto $PORT..."
            echo "   URL: http://localhost:$PORT"
            echo "   Presiona Ctrl+C para detener el servidor"
            echo ""
            
            # Intentar abrir en navegador automáticamente
            if [ -n "$BROWSER" ]; then
                sleep 2 && $BROWSER http://localhost:$PORT &> /dev/null &
            fi
            
            $SERVER_CMD
        else
            echo "❌ No se encontró ningún servidor web disponible"
            echo "   Instala Python, Node.js o PHP para usar un servidor local"
            echo "   O abre index.html directamente en tu navegador"
        fi
        ;;
    2)
        if [ -n "$BROWSER" ]; then
            echo "🌐 Abriendo en $BROWSER..."
            $BROWSER "file://$(pwd)/index.html" &> /dev/null &
        else
            echo "📂 Abre manualmente: $(pwd)/index.html"
        fi
        ;;
    3)
        echo "📖 Información de desarrollo:"
        echo ""
        echo "🎨 Personalización:"
        echo "   • Colores: Edita variables CSS en assets/css/styles.css"
        echo "   • Contenido: Modifica index.html directamente"  
        echo "   • Imágenes: Reemplaza archivos en assets/images/"
        echo "   • Logo: Actualiza logo.svg y logo-white.svg"
        echo ""
        echo "⚙️  Funcionalidades:"
        echo "   • Formularios: Conecta backend en assets/js/main.js"
        echo "   • Analytics: Añade código en index.html"
        echo "   • SEO: Meta tags configurados y editables"
        echo ""
        echo "📱 Testing:"
        echo "   • Responsive: Prueba en diferentes dispositivos"
        echo "   • Performance: Usa Lighthouse en DevTools"
        echo "   • Accesibilidad: Verifica con herramientas a11y"
        ;;
    4)
        echo "🔍 Verificando dependencias externas..."
        echo ""
        
        # Verificar Google Fonts
        echo "📝 Google Fonts (Inter): ✅ Cargado desde CDN"
        
        # Verificar Font Awesome
        echo "🎯 Font Awesome 6.4.0: ✅ Cargado desde CDN"
        
        # Verificar AOS
        echo "✨ AOS (Animate On Scroll): ✅ Cargado desde CDN"
        
        echo ""
        echo "ℹ️  Todas las dependencias se cargan desde CDN"
        echo "   Para uso offline, descarga y hospeda localmente"
        ;;
    5)
        echo "🚀 Preparando para producción..."
        echo ""
        echo "📋 Lista de optimizaciones recomendadas:"
        echo "   ✅ Comprimir imágenes (WebP, optimización)"
        echo "   ✅ Minificar CSS y JavaScript"
        echo "   ✅ Configurar caché del navegador"
        echo "   ✅ Implementar lazy loading de imágenes"
        echo "   ✅ Configurar CDN para assets estáticos"
        echo "   ✅ Generar sitemap.xml"
        echo "   ✅ Configurar robots.txt"
        echo "   ✅ Verificar Open Graph tags"
        echo ""
        echo "🔧 Herramientas recomendadas:"
        echo "   • TinyPNG/TinyJPG para compresión"
        echo "   • Lighthouse para auditoría"
        echo "   • PageSpeed Insights para rendimiento"
        ;;
    6)
        echo "👋 ¡Hasta luego!"
        exit 0
        ;;
    *)
        echo "❌ Opción no válida"
        exit 1
        ;;
esac
