# DalePata - Sistema de Adopción de Mascotas

## Descripción General

DalePata es una plataforma web integral para la gestión de adopción, cuidado y seguimiento de mascotas. El sistema está desarrollado con Next.js 14.2.16 utilizando el App Router, e implementa una arquitectura moderna basada en componentes reutilizables y gestión centralizada del estado de autenticación.

La aplicación permite a diferentes tipos de usuarios (adoptantes, refugios) interactuar dentro de un ecosistema unificado para facilitar el proceso de adopción y cuidado de animales.

## Tecnologías Principales

- **Framework**: Next.js 14.2.16
- **React**: 18
- **Gestor de Paquetes**: pnpm
- **Autenticación**: JWT (JSON Web Tokens)
- **UI Components**: shadcn/ui con Radix UI
- **Estilos**: Tailwind CSS 3.4.1
- **Mapas**: Mapbox GL JS
- **Validación de Formularios**: React Hook Form con Zod
- **Notificaciones**: SweetAlert2
- **Formateo de Fechas**: date-fns

## Arquitectura del Proyecto

### Estructura de Directorios

```
DalePataFront/
├── app/                          # App Router de Next.js
│   ├── globals.css              # Estilos globales y configuración Tailwind
│   ├── layout.js                # Layout principal con AuthProvider
│   ├── page.jsx                 # Landing page pública
│   ├── inicio/page.jsx          # Página principal de usuarios autenticados
│   │
│   ├── auth/                    # Sistema de autenticación
│   │   ├── login/page.js
│   │   ├── registro/page.js
│   │   ├── confirmacion/page.js
│   │   ├── recuperar-contrasena/page.js
│   │   └── reset-password/page.js
│   │
│   ├── adoptar/                 # Módulo de adopción
│   │   ├── page.jsx             # Catálogo de mascotas disponibles
│   │   └── [id]/page.jsx        # Perfil detallado y formulario de solicitud
│   │
│   ├── seguimiento/page.jsx     # Seguimiento de solicitudes de adopción
│   │
│   ├── perdidos/                # Mascotas perdidas y encontradas
│   │   ├── page.jsx             # Visualización de reportes (lista y mapa)
│   │   └── reportar/page.jsx    # Formulario de reporte
│   │
│   ├── perfil/page.js           # Gestión de perfil de usuario
│   ├── favoritos/page.js        # Mascotas marcadas como favoritas
│   ├── historial/page.js        # Historial de actividades
│   ├── notificaciones/page.jsx  # Centro de notificaciones
│   │
│   └── admin/                   # Panel administrativo para refugios
│       └── refugio/
│           ├── page.jsx                  # Dashboard principal
│           ├── mascotas/page.jsx         # Gestión de mascotas
│           ├── solicitudes/page.jsx      # Gestión de solicitudes
│           ├── perdidos/page.jsx         # Reportes de mascotas perdidas
│           └── configuracion/page.jsx    # Configuración del refugio
│
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base de shadcn/ui
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── form.jsx
│   │   ├── select.jsx
│   │   ├── table.jsx
│   │   └── ... (40+ componentes UI)
│   │
│   ├── admin/                   # Componentes específicos de administración
│   │   ├── add-pet-modal.jsx
│   │   ├── edit-pet-modal.jsx
│   │   ├── admin-protected-route.jsx
│   │   └── ...
│   │
│   ├── user/                    # Componentes específicos de usuarios
│   │   ├── user-add-pet-modal.jsx
│   │   ├── user-edit-pet-modal.jsx
│   │   ├── user-protected-route.jsx
│   │   └── ...
│   │
│   ├── backend-auth-provider.js # Proveedor de contexto de autenticación
│   ├── notifications-dropdown.jsx # Sistema de notificaciones
│   ├── header.js                # Barra de navegación superior
│   ├── sidebar.js               # Menú lateral de navegación
│   ├── adoption-grid.jsx        # Grilla de mascotas en adopción
│   ├── adoption-form.jsx        # Formulario de solicitud de adopción
│   ├── pet-profile.jsx          # Perfil detallado de mascota
│   ├── report-pet-form.jsx      # Formulario de reporte de mascotas
│   ├── mapa-perdidos.jsx        # Mapa interactivo con Mapbox
│   └── ... (50+ componentes especializados)
│
├── lib/                         # Utilidades y configuración
│   ├── api.js                   # Servicio de API REST
│   ├── api-config.js            # Endpoints y configuración de API
│   ├── utils.js                 # Funciones auxiliares
│   ├── sweetalert.js            # Configuración de alertas
│   └── supabase/               # Cliente de Supabase (almacenamiento)
│
├── hooks/                       # Custom React Hooks
│   ├── use-mobile.js
│   └── use-toast.js
│
├── public/                      # Archivos estáticos
│   └── images/
│
├── styles/                      # Estilos adicionales
│   └── globals.css
│
└── scripts/                     # Scripts de utilidad
    └── test-multi-registration.js
```

## Módulos Principales

### 1. Sistema de Autenticación

El sistema de autenticación está construido sobre JWT (JSON Web Tokens) y se integra con un backend API REST. Soporta múltiples tipos de usuarios:

- **Usuarios regulares**: Personas que buscan adoptar mascotas
- **Refugios**: Organizaciones que publican mascotas para adopción

#### Componentes de Autenticación

- `backend-auth-provider.js`: Contexto global que gestiona el estado de autenticación, tokens JWT y datos de usuario
- `protected-route.jsx`: HOC para proteger rutas que requieren autenticación
- `admin-protected-route.jsx`: HOC específico para rutas administrativas de refugios
- `user-protected-route.jsx`: HOC para rutas de usuarios regulares

#### Flujos Implementados

1. **Registro**: Formulario multi-tipo con validación específica según el tipo de usuario
2. **Login**: Autenticación con email y contraseña, almacenamiento de token en localStorage
3. **Recuperación de contraseña**: Integración con Supabase para reset de contraseña
4. **Actualización de perfil**: Modificación de datos personales y cambio de contraseña
5. **Logout**: Limpieza de tokens y redirección

### 2. Módulo de Adopción

Sistema completo para la gestión del proceso de adopción de mascotas.

#### Funcionalidades

- **Catálogo de mascotas**: Visualización de todas las mascotas disponibles para adopción
- **Filtros avanzados**: Por especie, raza, edad, tamaño, género y ubicación
- **Perfil detallado**: Información completa de cada mascota con galería de imágenes
- **Solicitud de adopción**: Formulario estructurado con preguntas sobre:
  - Tipo de vivienda y espacio disponible
  - Experiencia previa con mascotas
  - Mascotas actuales en el hogar
  - Razón de adopción
  - Compromiso de tiempo
- **Seguimiento de solicitudes**: Panel para ver el estado de solicitudes enviadas

#### Componentes Clave

- `adoption-grid.jsx`: Grilla responsiva de mascotas
- `adoption-card.jsx`: Tarjeta individual con información resumida
- `adoption-filters.jsx`: Sistema de filtrado con múltiples criterios
- `adoption-form.jsx`: Formulario de solicitud con validación
- `pet-profile.jsx`: Vista detallada de mascota individual

### 3. Módulo de Mascotas Perdidas

Sistema de reporte y seguimiento de mascotas perdidas con geolocalización.

#### Funcionalidades

- **Visualización dual**: Lista y mapa interactivo con Mapbox
- **Reporte de mascotas perdidas**: Formulario con ubicación geográfica
- **Reporte de avistamientos**: Permite reportar mascotas vistas
- **Geolocalización**: Marcadores en mapa con información de contacto
- **Búsqueda geográfica**: Filtrado por proximidad

#### Componentes Principales

- `mapa-perdidos.jsx`: Mapa interactivo con Mapbox GL
- `report-pet-form.jsx`: Formulario de reporte con selector de ubicación
- `lost-found-card.jsx`: Tarjeta de mascota perdida
- `lost-found-tabs.jsx`: Tabs para alternar entre perdidas y encontradas

### 4. Panel Administrativo para Refugios

Dashboard completo para la gestión de mascotas y solicitudes de adopción.

#### Funcionalidades

- **Dashboard**: Estadísticas y métricas del refugio
  - Total de mascotas registradas
  - Mascotas disponibles para adopción
  - Solicitudes pendientes
  - Actividad reciente
- **Gestión de mascotas**:
  - Crear, editar y eliminar registros
  - Actualización de estado de salud
  - Gestión de disponibilidad para adopción
  - Carga de imágenes
- **Gestión de solicitudes**:
  - Visualización de solicitudes recibidas
  - Aprobación o rechazo con comentarios
  - Filtrado por estado
  - Vista detallada de información del solicitante
- **Configuración**: Actualización de datos del refugio

#### Componentes Administrativos

- `add-pet-modal.jsx`: Modal para registrar nueva mascota
- `edit-pet-modal.jsx`: Modal para editar información de mascota
- `admin-protected-route.jsx`: Protección de rutas administrativas

### 5. Sistema de Notificaciones

Sistema de notificaciones en tiempo diferido para mantener informados a los usuarios sobre eventos importantes.

#### Funcionalidades

- Notificaciones de cambio de estado en solicitudes de adopción
- Contador de notificaciones no leídas
- Marcar notificaciones como leídas (individual o masivo)
- Eliminación de notificaciones
- Auto-actualización periódica (30 segundos)
- Navegación contextual al hacer clic en notificación

#### Componentes

- `notifications-dropdown.jsx`: Dropdown con lista de notificaciones en el header

### 6. Gestión de Perfil de Usuario

Módulo para la administración de información personal del usuario.

#### Funcionalidades

- Visualización de datos del usuario
- Edición de información personal (nombre, apellido, teléfono)
- Cambio de contraseña con validación de seguridad
- Gestión de mascotas propias (para usuarios regulares)

## Servicios de API

### ApiService (`lib/api.js`)

Servicio centralizado que gestiona todas las comunicaciones con el backend.

#### Métodos Principales

**Autenticación**
- `login(email, password, userType)`
- `register(userData)`
- `registerByType(userData, userType)`
- `getUserProfile()`
- `updateUserProfile(userData)`
- `updatePassword(passwordData)`
- `requestPasswordReset(email)`
- `resetPassword(token, newPassword)`
- `syncPasswordFromSupabase(email, newPassword)`

**Mascotas**
- `fetchPets()`: Listar mascotas disponibles para adopción
- `fetchMyPets()`: Mascotas del usuario autenticado
- `fetchPetById(petId)`: Obtener detalles de una mascota
- `createPet(formData)`: Registrar nueva mascota
- `updatePet(petId, petData)`: Actualizar información
- `deletePet(petId)`: Eliminar mascota
- `getAdminPets()`: Mascotas del refugio (admin)

**Solicitudes de Adopción**
- `getAdoptionRequests(params)`: Listar solicitudes
- `getAdoptionRequestById(requestId)`: Obtener solicitud específica
- `createAdoptionRequest(petId, formData)`: Crear solicitud
- `updateAdoptionRequestStatus(requestId, estado, comentario)`: Actualizar estado
- `getMyAdoptionRequests()`: Solicitudes del usuario
- `cancelAdoptionRequest(requestId)`: Cancelar solicitud

**Mascotas Perdidas**
- `fetchLostPets()`: Listar mascotas perdidas
- `reportPetAsLost(petId, data)`: Reportar como perdida
- `reportLostPetSighting(data)`: Reportar avistamiento
- `markPetAsFound(petId)`: Marcar como encontrada
- `deleteLostPetReport(petId)`: Eliminar reporte

**Notificaciones**
- `getNotifications(params)`: Obtener notificaciones del usuario
- `getUnreadNotificationsCount()`: Contador de no leídas
- `markNotificationAsRead(notificationId)`: Marcar como leída
- `markAllNotificationsAsRead()`: Marcar todas como leídas
- `deleteNotification(notificationId)`: Eliminar notificación

### Gestión de Tokens

El sistema utiliza localStorage para persistir tokens JWT:

```javascript
// Almacenamiento
localStorage.setItem('dalepata-auth-token', token)
localStorage.setItem('dalepata-user', JSON.stringify(user))

// Recuperación
const token = localStorage.getItem('dalepata-auth-token')
const user = JSON.parse(localStorage.getItem('dalepata-user'))
```

### Manejo de Errores

Implementación centralizada con:
- Detección de tokens expirados (401)
- Redirección automática al login cuando la sesión expira
- Mensajes de error específicos por contexto
- Logging detallado para desarrollo

## Componentes UI

El proyecto utiliza **shadcn/ui**, una colección de componentes construidos con Radix UI y Tailwind CSS.

### Componentes Implementados

- **Formularios**: Button, Input, Label, Textarea, Select, Checkbox, Radio Group
- **Navegación**: Dropdown Menu, Navigation Menu, Tabs, Breadcrumb
- **Feedback**: Alert, Alert Dialog, Toast, Dialog, Popover
- **Visualización**: Card, Table, Badge, Avatar, Separator
- **Layout**: Scroll Area, Resizable, Sheet, Sidebar
- **Datos**: Calendar, Form (React Hook Form), Chart
- **Otros**: Command, Context Menu, Hover Card, Progress, Skeleton

### Personalización

Los componentes se configuran a través de:
- `tailwind.config.js`: Variables de diseño y tema
- `components.json`: Configuración de shadcn/ui
- `app/globals.css`: Estilos globales y variables CSS

## Rutas y Navegación

### Rutas Públicas

- `/`: Landing page con información institucional
- `/auth/login`: Inicio de sesión
- `/auth/registro`: Registro de nuevos usuarios
- `/auth/recuperar-contrasena`: Recuperación de contraseña
- `/auth/reset-password`: Reset de contraseña
- `/auth/confirmacion`: Confirmación de registro

### Rutas Protegidas (Usuario)

- `/inicio`: Dashboard principal del usuario
- `/adoptar`: Catálogo de mascotas disponibles
- `/adoptar/[id]`: Perfil de mascota y formulario de adopción
- `/seguimiento`: Seguimiento de solicitudes de adopción
- `/perdidos`: Mascotas perdidas y encontradas
- `/perdidos/reportar`: Formulario de reporte
- `/perfil`: Gestión de perfil de usuario
- `/favoritos`: Mascotas marcadas como favoritas
- `/historial`: Historial de actividades del usuario
- `/notificaciones`: Centro de notificaciones

### Rutas Administrativas (Refugio)

- `/admin/refugio`: Dashboard del refugio con estadísticas
- `/admin/refugio/mascotas`: Gestión de mascotas del refugio
- `/admin/refugio/solicitudes`: Gestión de solicitudes de adopción
- `/admin/refugio/perdidos`: Reportes de mascotas perdidas
- `/admin/refugio/configuracion`: Configuración del refugio

## Configuración del Proyecto

### Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# API Backend
NEXT_PUBLIC_API_BASE_URL=https://api.dalepata.com/api

# Supabase (Almacenamiento de imágenes)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Mapbox (Mapas)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Instalación

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Build de producción
pnpm build

# Ejecutar producción
pnpm start

# Linting
pnpm lint
```

### Dependencias Principales

**Core**
- `next`: 14.2.16
- `react`: 18.3.1
- `react-dom`: 18.3.1

**UI y Estilos**
- `tailwindcss`: 3.4.1
- `@radix-ui/*`: Componentes UI primitivos
- `lucide-react`: Iconos
- `class-variance-authority`: Variantes de componentes
- `clsx` y `tailwind-merge`: Utilidades de clases

**Formularios y Validación**
- `react-hook-form`: 7.54.2
- `zod`: 3.24.1
- `@hookform/resolvers`: 3.9.1

**Mapas y Geolocalización**
- `mapbox-gl`: 3.8.0
- `@mapbox/mapbox-gl-geocoder`: 5.0.3

**Utilidades**
- `date-fns`: 4.1.0
- `sweetalert2`: 11.15.3

## Flujos de Usuario Principales

### Flujo de Adopción

1. Usuario navega al catálogo de mascotas (`/adoptar`)
2. Aplica filtros según sus preferencias
3. Selecciona una mascota de interés
4. Visualiza el perfil detallado de la mascota (`/adoptar/[id]`)
5. Completa el formulario de solicitud de adopción
6. El sistema crea la solicitud en estado "pendiente"
7. Usuario puede hacer seguimiento de su solicitud en `/seguimiento`
8. El refugio recibe una notificación de nueva solicitud
9. El refugio revisa y aprueba/rechaza la solicitud en `/admin/refugio/solicitudes`
10. El usuario recibe notificación del resultado

### Flujo de Reporte de Mascota Perdida

1. Usuario accede a `/perdidos/reportar`
2. Completa el formulario con los datos de la mascota
3. Selecciona la ubicación en el mapa interactivo
4. Opcionalmente carga una fotografía de la mascota
5. El sistema registra el reporte con geolocalización
6. El reporte aparece en `/perdidos` (vista de lista y mapa)
7. Otros usuarios pueden visualizar el reporte y reportar avistamientos
8. El propietario puede marcar la mascota como encontrada

### Flujo Administrativo (Refugio)

1. Refugio accede a su dashboard `/admin/refugio`
2. Visualiza estadísticas generales del refugio
3. Registra una nueva mascota en `/admin/refugio/mascotas`
4. Completa el formulario con datos completos y fotografía
5. Marca la mascota como disponible para adopción
6. La mascota aparece en el catálogo público
7. Recibe solicitudes de adopción en `/admin/refugio/solicitudes`
8. Revisa la información del solicitante
9. Aprueba o rechaza la solicitud con comentario
10. El sistema notifica automáticamente al solicitante

## Características Técnicas Destacadas

### Optimización de Imágenes

Utiliza Next.js Image component con:
- Lazy loading automático
- Optimización de tamaño según viewport
- Formatos modernos (WebP)
- Placeholders mientras carga

### Server-Side Rendering (SSR)

Utilización estratégica de:
- Server Components para contenido estático
- Client Components (`"use client"`) solo donde se necesita interactividad
- Streaming para mejorar tiempo de carga inicial

### Responsive Design

- Enfoque mobile-first
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Componentes adaptables a diferentes dispositivos
- Menú lateral colapsable en móviles

### Gestión de Estado

- Context API para autenticación global
- useState y useEffect para estado local de componentes
- Custom hooks para lógica reutilizable
- localStorage para persistencia de sesión

### Validación de Formularios

Integración de React Hook Form + Zod:
- Validación en tiempo real
- Mensajes de error personalizados
- Esquemas de validación tipados
- Optimización de re-renders

## Consideraciones de Seguridad

- Tokens JWT almacenados en localStorage
- Validación de permisos en cada request al backend
- Rutas protegidas mediante HOCs (Higher-Order Components)
- Sanitización de inputs en formularios
- CORS configurado correctamente en el backend
- Comunicación HTTPS en producción
- Manejo seguro de credenciales

## Despliegue

### Opciones de Despliegue

**Vercel** (Recomendado para Next.js)
```bash
pnpm build
# Deploy automático con git push
```

**Dokploy con Nixpacks**
- Auto-detección de Next.js
- Build automático
- Variables de entorno configurables en panel

**Docker**
```dockerfile
# Ver Dockerfile en la raíz del proyecto
# Build standalone para producción
```

### Configuración de Producción

1. Configurar variables de entorno en la plataforma de hosting
2. Asegurar que `NEXT_PUBLIC_API_BASE_URL` apunte a la API de producción
3. Configurar dominio personalizado
4. Habilitar SSL/HTTPS
5. Configurar redirects y rewrites necesarios

## Documentación Adicional

- `NOTIFICATIONS_README.md`: Documentación detallada del sistema de notificaciones
- `NOTIFICATIONS_BACKEND_SPEC.md`: Especificación técnica para implementación en backend
- `DEPLOY_NIXPACKS.md`: Guía de despliegue con Nixpacks
- `DEPLOY_DOKPLOY.md`: Guía de despliegue con Dokploy usando Docker
- `QUICK_DEPLOY.md`: Guía rápida de despliegue

## Mantenimiento y Desarrollo

### Convenciones de Código

- Componentes en PascalCase
- Archivos de componentes con extensión `.jsx` o `.js`
- Funciones auxiliares en camelCase
- Constantes en UPPER_SNAKE_CASE
- Uso de ESLint para consistencia de código

### Control de Versiones

- Repositorio: GitHub
- Branch principal: `main`
- Commits descriptivos siguiendo convenciones
- Pull requests para cambios importantes

## Contacto y Soporte

Para consultas técnicas o reportar issues, contactar al equipo de desarrollo o abrir un issue en el repositorio de GitHub.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025  
**Desarrollado con**: Next.js 14.2.16
