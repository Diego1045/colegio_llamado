#!/bin/bash

# Script de instalación para Colegio Llamado - Backend Laravel
# Uso: chmod +x install.sh && ./install.sh

echo "🚀 Instalando Colegio Llamado - Backend Laravel"
echo "================================================"

# Verificar si PHP está instalado
if ! command -v php &> /dev/null; then
    echo "❌ PHP no está instalado. Por favor instala PHP 8.1 o superior."
    exit 1
fi

# Verificar versión de PHP
PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
if [[ $(echo "$PHP_VERSION < 8.1" | bc -l) -eq 1 ]]; then
    echo "❌ Se requiere PHP 8.1 o superior. Versión actual: $PHP_VERSION"
    exit 1
fi

echo "✅ PHP $PHP_VERSION detectado"

# Verificar si Composer está instalado
if ! command -v composer &> /dev/null; then
    echo "❌ Composer no está instalado. Por favor instala Composer."
    echo "   Visita: https://getcomposer.org/download/"
    exit 1
fi

echo "✅ Composer detectado"

# Instalar dependencias de PHP
echo "📦 Instalando dependencias de PHP..."
composer install --no-dev --optimize-autoloader

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias de PHP"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "⚙️ Creando archivo de configuración..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
else
    echo "⚠️ Archivo .env ya existe, no se sobrescribirá"
fi

# Generar clave de aplicación
echo "🔑 Generando clave de aplicación..."
php artisan key:generate --force

# Verificar conexión a base de datos
echo "🗄️ Verificando conexión a base de datos..."
php artisan migrate:status &> /dev/null

if [ $? -ne 0 ]; then
    echo "⚠️ No se pudo conectar a la base de datos."
    echo "   Por favor configura las credenciales en el archivo .env:"
    echo "   - DB_HOST"
    echo "   - DB_DATABASE"
    echo "   - DB_USERNAME"
    echo "   - DB_PASSWORD"
    echo ""
    echo "   Luego ejecuta: php artisan migrate && php artisan db:seed"
else
    # Ejecutar migraciones
    echo "🔄 Ejecutando migraciones..."
    php artisan migrate --force
    
    if [ $? -eq 0 ]; then
        echo "✅ Migraciones ejecutadas correctamente"
        
        # Ejecutar seeders
        echo "🌱 Poblando base de datos..."
        php artisan db:seed --force
        
        if [ $? -eq 0 ]; then
            echo "✅ Base de datos poblada correctamente"
        else
            echo "⚠️ Error poblando base de datos"
        fi
    else
        echo "❌ Error ejecutando migraciones"
    fi
fi

# Publicar configuración de Sanctum
echo "🔐 Configurando autenticación..."
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --force

# Limpiar y optimizar
echo "🧹 Optimizando aplicación..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Crear enlace simbólico para storage (si es necesario)
if [ ! -L public/storage ]; then
    php artisan storage:link
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo "=========================="
echo ""
echo "📋 Información importante:"
echo "• Usuario admin: admin@colegio.com"
echo "• Contraseña admin: admin123"
echo "• 10 códigos de invitación generados"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   php artisan serve"
echo ""
echo "🔗 La API estará disponible en:"
echo "   http://localhost:8000/api"
echo ""
echo "🧪 Para probar la API:"
echo "   curl http://localhost:8000/api/health"
echo ""
echo "📚 Consulta el README.md para más información"