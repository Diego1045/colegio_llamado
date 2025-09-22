# Sistema de Gestión de Salida de Estudiantes

Sistema web para la gestión de salida de estudiantes, incluyendo registro de llamadas, códigos de invitación y administración de horarios.

## Características Principales

- 🚪 Gestión de salida de estudiantes
- 📱 Interfaz responsiva para padres y administradores
- 🔐 Sistema de autenticación seguro con Laravel Sanctum
- 📊 Panel de administración con estadísticas
- 🎫 Generación y gestión de códigos de invitación
- ⏰ Configuración de horarios por nivel
- 📱 Notificaciones en tiempo real
- 🎙️ Sistema de anuncios por micrófono
- 🔄 Backend Laravel con APIs RESTful

## Requisitos Técnicos

### Frontend
- Node.js 16.x o superior
- Vue.js 3.x
- Vite

### Backend
- PHP 8.1 o superior
- Laravel 10.x
- SQLite (desarrollo) / MySQL (producción)
- Composer

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/colegio-llamado.git
cd colegio-llamado
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con la configuración de la aplicación:

```
# Configuración de Laravel API
VITE_API_URL=http://127.0.0.1:8000/api

# Configuración de la aplicación
VITE_APP_NAME="Colegio Llamado"
VITE_APP_ENV=local # Opciones: local, development, production
```

4. Configurar el backend Laravel:
```bash
cd colegio-llamado-laravel
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
```

5. Iniciar los servidores:

Backend Laravel:
```bash
cd colegio-llamado-laravel
php artisan serve
```

Frontend Vue.js (en otra terminal):
```bash
npm run dev
```

## Estructura del Proyecto

```
colegio-llamado/
├── src/                          # Frontend Vue.js
│   ├── assets/                   # Recursos estáticos
│   ├── components/               # Componentes Vue
│   ├── views/                    # Vistas principales
│   ├── router/                   # Configuración de rutas
│   ├── stores/                   # Estado global (Pinia)
│   └── services/                 # Servicios API
├── colegio-llamado-laravel/      # Backend Laravel
│   ├── app/                      # Aplicación Laravel
│   ├── database/                 # Migraciones y seeders
│   ├── routes/                   # Rutas API
│   └── config/                   # Configuración
├── public/                       # Archivos públicos
└── docs/                         # Documentación
```

## Documentación

- [Manual de Usuario](./docs/manual-usuario.md)
- [Documentación Técnica](./docs/documentacion-tecnica.md)
- [Estructura de la Base de Datos](./docs/database.md)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Módulos principales

### Sistema de Anuncios por Micrófono (Nuevo)

El sistema permite a los administradores realizar anuncios por micrófono utilizando la API de síntesis de voz del navegador. Características:

- Lista de estudiantes pendientes de llamar
- Anuncios automáticos con datos del estudiante
- Anuncios manuales para casos especiales
- Historial de anuncios realizados
- Marcado de registros como completados

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/tu-usuario/colegio-llamado](https://github.com/tu-usuario/colegio-llamado)
