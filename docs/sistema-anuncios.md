# Sistema de Anuncios por Micrófono

## Descripción General

El Sistema de Anuncios por Micrófono es un módulo que permite a los administradores del colegio realizar anuncios vocales para llamar a los estudiantes cuando sus representantes llegan a recogerlos. Utiliza la API de síntesis de voz del navegador (Web Speech API) para generar anuncios sonoros en tiempo real.

## Características Principales

- **Listado de estudiantes pendientes**: Muestra todos los estudiantes que han sido solicitados por sus representantes y están esperando ser llamados.
- **Anuncios automáticos**: Genera automáticamente los mensajes de voz con el nombre, apellido, grado y sección del estudiante.
- **Anuncios manuales**: Permite realizar anuncios para estudiantes que no están registrados en el sistema o casos especiales.
- **Historial de anuncios**: Mantiene un registro de todos los anuncios realizados y su estado.
- **Gestión de estados**: Permite marcar los llamados como "anunciados" o "completados".
- **Interfaz intuitiva**: Diseño moderno y fácil de usar para los administradores.

## Requisitos Técnicos

- Navegador moderno con soporte para Web Speech API (Chrome, Edge, Safari, Firefox)
- Dispositivo con altavoces o sistema de sonido conectado para la reproducción de los anuncios
- Permisos de usuario para reproducir audio

## Cómo Usar

### Acceso al Módulo

1. Iniciar sesión con una cuenta de administrador
2. Ir al Dashboard
3. Hacer clic en la tarjeta "Sistema de Anuncios"

### Anunciar un Estudiante desde la Lista de Pendientes

1. En la sección "Estudiantes pendientes de llamado", localizar al estudiante que desea anunciar
2. Hacer clic en el botón "Anunciar" junto al nombre del estudiante
3. El sistema reproducirá automáticamente el anuncio por los altavoces
4. El registro cambiará automáticamente a estado "anunciado"
5. Cuando el estudiante sea recogido, hacer clic en "Completado"

### Realizar un Anuncio Manual

1. En la sección "Anuncio manual", completar los campos:
   - Nombre
   - Apellido
   - Grado (opcional)
   - Sección (opcional)
2. Hacer clic en "Realizar anuncio"
3. El sistema reproducirá el anuncio por los altavoces
4. El anuncio se registrará automáticamente en el historial

## Estructura Técnica

### Componentes Principales

- **AnuncioMicrofono.vue**: Componente principal que gestiona todas las funcionalidades del sistema de anuncios.
- **Anuncios.vue**: Vista que integra el componente principal y proporciona funcionalidades adicionales.

### Base de Datos

El módulo utiliza la tabla `registros_salida` con los siguientes campos específicos:

- `tipo`: Distingue entre anuncios normales y manuales ('normal'/'manual')
- `estado`: Estado del registro ('pendiente'/'anunciado'/'completado'/'cancelado')
- `nombre_manual`, `apellido_manual`, `grado_manual`, `seccion_manual`: Campos para anuncios manuales
- `anunciado_por`: ID del usuario que realizó el anuncio

## Configuración en Ambiente Local

Para desarrollo local, se puede usar la variable `VITE_APP_ENV=local` en el archivo `.env` para habilitar:

- Acceso a todas las rutas sin restricciones de roles
- Visualización de todas las funcionalidades independientemente del rol del usuario
- Mensajes de depuración adicionales en la consola

**Importante:** Incluso en ambiente local, la aplicación sigue conectándose a la base de datos Supabase para todas las operaciones CRUD. El modo local solo afecta a las restricciones de acceso y visualización de componentes, no a la conexión con la base de datos.

## Troubleshooting

### No se reproduce el audio

- Verificar que el navegador tenga permisos para reproducir audio
- Asegurarse de que los altavoces estén conectados y funcionando
- Comprobar que el navegador soporte la Web Speech API
- Usar el botón "Prueba de audio" para verificar la configuración

### Problemas con los registros pendientes

- Verificar que los registros en la tabla `registros_salida` tengan el estado 'pendiente'
- Comprobar la conexión con la base de datos
- Revisar los permisos de acceso a la tabla

## Desarrollado por

- [Tu Nombre](mailto:email@ejemplo.com)
- [Fecha de lanzamiento]: Mayo 2024 