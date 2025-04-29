# Sistema de Gestión de Salida de Estudiantes

Sistema web para la gestión de salida de estudiantes, incluyendo registro de llamadas, códigos de invitación y administración de horarios.

## Características Principales

- 🚪 Gestión de salida de estudiantes
- 📱 Interfaz responsiva para padres y administradores
- 🔐 Sistema de autenticación seguro
- 📊 Panel de administración con estadísticas
- 🎫 Generación y gestión de códigos de invitación
- ⏰ Configuración de horarios por nivel
- 📱 Notificaciones en tiempo real

## Requisitos Técnicos

- Node.js 16.x o superior
- Vue.js 3.x
- Supabase (Backend as a Service)
- PostgreSQL 14.x

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
Editar el archivo `.env` con tus credenciales de Supabase.

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
colegio-llamado/
├── src/
│   ├── assets/         # Recursos estáticos
│   ├── components/     # Componentes Vue
│   ├── views/          # Vistas principales
│   ├── router/         # Configuración de rutas
│   ├── store/          # Estado global
│   └── supabase/       # Configuración de Supabase
├── public/             # Archivos públicos
└── docs/              # Documentación
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

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@ejemplo.com

Link del Proyecto: [https://github.com/tu-usuario/colegio-llamado](https://github.com/tu-usuario/colegio-llamado)
