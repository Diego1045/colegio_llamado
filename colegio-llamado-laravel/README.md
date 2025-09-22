# Colegio Llamado - Backend Laravel

Sistema de gestión escolar desarrollado en Laravel para reemplazar la implementación actual con Supabase.

## 🚀 Características

- **Autenticación con roles**: Administradores y padres de familia
- **Gestión de estudiantes**: CRUD completo con relaciones padre-estudiante
- **Sistema de llamadas**: Registro y gestión de salidas de estudiantes
- **Códigos de invitación**: Sistema de invitaciones para registro de padres
- **Configuración flexible**: Horarios, límites y configuraciones del colegio
- **Estadísticas**: Métricas y reportes del sistema
- **API REST**: Endpoints completos para integración con frontend

## 📋 Requisitos

- PHP 8.1 o superior
- Composer
- MySQL 8.0 o PostgreSQL 14+
- Node.js (para scripts de migración)

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
cd colegio-llamado-laravel
composer install
```

### 2. Configurar entorno

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configurar base de datos

Edita el archivo `.env` con tus credenciales de base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=colegio_llamado
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Ejecutar migraciones y seeders

```bash
php artisan migrate
php artisan db:seed
```

### 5. Configurar Sanctum (autenticación API)

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

## 🔄 Migración desde Supabase

### Prerrequisitos

1. Instalar dependencias de Node.js para el script de migración:

```bash
npm install mysql2
```

2. Asegúrate de que tu base de datos MySQL esté creada y las migraciones ejecutadas.

### Ejecutar migración

Desde el directorio raíz del proyecto Vue.js:

```bash
node colegio-llamado-laravel/scripts/migrate-from-supabase.js
```

Este script:
- Conecta a tu instancia de Supabase
- Extrae todos los datos de las tablas
- Los inserta en la base de datos MySQL de Laravel
- Mantiene los UUIDs originales para preservar las relaciones

## 🚀 Uso

### Iniciar servidor de desarrollo

```bash
php artisan serve
```

El servidor estará disponible en `http://localhost:8000`

### Probar la API

```bash
# Verificar que la API funciona
curl http://localhost:8000/api/health

# Login de administrador (después de ejecutar seeders)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@colegio.com","password":"admin123"}'
```

## 📚 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario (requiere código de invitación)
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/validate-code` - Validar código de invitación

### Estudiantes
- `GET /api/estudiantes` - Listar estudiantes
- `POST /api/estudiantes` - Crear estudiante (admin)
- `GET /api/estudiantes/{id}` - Ver estudiante
- `PUT /api/estudiantes/{id}` - Actualizar estudiante (admin)
- `DELETE /api/estudiantes/{id}` - Eliminar estudiante (admin)

### Registros de Salida
- `GET /api/registros-salida` - Listar registros
- `POST /api/registros-salida` - Crear registro de llamada
- `GET /api/registros-salida/{id}` - Ver registro
- `PATCH /api/registros-salida/{id}/status` - Actualizar estado (admin)
- `DELETE /api/registros-salida/{id}` - Eliminar registro

## 🔐 Autenticación

El sistema usa Laravel Sanctum para autenticación API. Incluye el token en el header:

```
Authorization: Bearer {token}
```

## 👥 Roles y Permisos

### Administrador (`admin`)
- Gestión completa de estudiantes
- Gestión de registros de salida
- Acceso a todas las estadísticas
- Gestión de códigos de invitación

### Padre (`padre`)
- Ver sus estudiantes asignados
- Crear llamadas para sus estudiantes
- Ver sus propios registros de salida
- Limitaciones de horario y cantidad de llamadas

## ⚙️ Configuración

El sistema incluye configuraciones flexibles:

- `horario_inicio`: Hora de inicio del horario escolar
- `horario_fin`: Hora de fin del horario escolar
- `max_llamadas_por_dia`: Máximo de llamadas por estudiante por día
- `nombre_colegio`: Nombre del colegio
- `timezone`: Zona horaria

## 🔄 Actualizar Frontend Vue.js

Para conectar tu frontend Vue.js existente con Laravel:

1. **Actualizar configuración de API**:
   ```javascript
   // En lugar de Supabase
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

2. **Implementar autenticación con tokens**:
   ```javascript
   // Guardar token después del login
   localStorage.setItem('auth_token', response.data.token);
   
   // Incluir en requests
   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   ```

3. **Adaptar llamadas a la API**:
   ```javascript
   // Ejemplo: obtener estudiantes
   const response = await axios.get('/api/estudiantes');
   ```

## 🧪 Testing

```bash
# Ejecutar tests
php artisan test

# Ejecutar tests con cobertura
php artisan test --coverage
```

## 📊 Base de Datos

### Estructura Principal

- **users**: Usuarios del sistema (admins y padres)
- **estudiantes**: Información de estudiantes
- **padres_estudiantes**: Relación muchos a muchos
- **registros_salida**: Llamadas de salida
- **codigos_invitacion**: Códigos para registro
- **configuracion**: Configuraciones del sistema
- **stats**: Estadísticas diarias

### Relaciones

- Un padre puede tener múltiples estudiantes
- Un estudiante puede tener múltiples padres
- Cada registro de salida pertenece a un estudiante y un padre
- Los códigos de invitación se marcan como usados al registrarse

## 🚀 Despliegue

### Producción

1. Configurar servidor web (Apache/Nginx)
2. Configurar base de datos de producción
3. Ejecutar migraciones en producción
4. Configurar variables de entorno
5. Optimizar aplicación:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Para soporte técnico o preguntas:

1. Revisar la documentación
2. Verificar issues existentes
3. Crear nuevo issue con detalles del problema

---

**Desarrollado para Colegio Llamado** 🏫