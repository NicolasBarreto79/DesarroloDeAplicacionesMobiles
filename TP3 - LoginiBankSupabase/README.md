# iBank — Flujo de Autenticación Bancaria con Supabase

**Trabajo Práctico N° 3 — Arquitectura y Programación Móvil (2026)**  
*Facultad de Ciencia y Tecnología (FCyT) — Sede Concepción del Uruguay*  
*Licenciatura en Sistemas de Información*

---

## Descripción del Proyecto

Implementación completa y profesional del flujo de autenticación (inicio de sesión, registro, confirmación y recuperación de contraseña) para la aplicación bancaria **iBank**, inspirada en el kit de diseño de **Figma (iBank — Banking & E-Money Management App)** y conectada a **Supabase Auth** como único backend.

El proyecto cumple con todas las reglas de negocio bancarias, prevención de enumeración de usuarios, persistencia de sesión segura, auto-refresh según ciclo de vida de la aplicación (`AppState`), rutas protegidas mediante Expo Router y soporte de Deep Linking bidireccional (`ibanktp://`).

---

## Stack Tecnológico

- **Framework**: [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/) (SDK 57)
- **Navegación**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing idiomático con grupos `(auth)` y `(app)`)
- **Backend / BaaS**: [@supabase/supabase-js v2](https://supabase.com/docs/reference/javascript/introduction)
- **Polyfill URL**: `react-native-url-polyfill`
- **Persistencia de Sesión**: `@react-native-async-storage/async-storage`
- **Gestión y Validación de Formularios**: `react-hook-form` + `zod` con `@hookform/resolvers`
- **Deep Linking**: `expo-linking` (`ibanktp://`)
- **Iconografía y UI**: `@expo/vector-icons` (Ionicons) con sistema de diseño iBank a medida

---

## Estructura del Código

```text
LoginiBankSupabase/
├── assets/                  # Iconos nativos, splash screen y recursos gráficos
├── screenshots/             # Evidencias visuales de las 5 pantallas y flujos
├── src/
│   ├── app/                 # Rutas con Expo Router
│   │   ├── _layout.tsx      # Layout raíz con AuthProvider y Stack navigation
│   │   ├── index.tsx        # Redirección inteligente según estado de sesión
│   │   ├── (auth)/          # Grupo de rutas públicas de autenticación
│   │   │   ├── _layout.tsx  # Stack sin encabezados para el flujo auth
│   │   │   ├── login.tsx    # 01. Iniciar sesión (anti-enumeración y rate limit)
│   │   │   ├── register.tsx # 02. Registro con checklist visual en tiempo real
│   │   │   ├── confirm-pending.tsx # 03. Confirmación con cooldown y resend
│   │   │   ├── forgot-password.tsx # 04. Recuperación con mensaje neutro
│   │   │   └── reset-password.tsx  # 05. Nueva contraseña (deep link + error guard)
│   │   └── (app)/           # Grupo de rutas protegidas
│   │       ├── _layout.tsx  # Guardia de sesión activa (redirección a login)
│   │       └── home.tsx     # Pantalla principal con tarjeta iBank y logout
│   ├── components/
│   │   └── ui/              # Componentes de UI accesibles (touch target >= 50px)
│   │       ├── AlertBanner.tsx       # Banners informativos y de error
│   │       ├── AuthHeader.tsx        # Header con navegación y botón Volver
│   │       ├── AuthIllustration.tsx  # Candado oficial Figma con acentos semánticos
│   │       ├── Button.tsx            # Botón accesible con estados y cooldown 60s
│   │       ├── Checkbox.tsx          # Checkbox accesible para Términos y Condiciones
│   │       ├── Input.tsx             # Input con estados focus, error y ver clave
│   │       └── PasswordChecklist.tsx # Checklist dinámico de 5 reglas bancarias
│   ├── constants/
│   │   ├── theme.ts         # Tokens de diseño oficiales Figma iBank
│   │   └── version.ts       # Metadatos tipados de versión y scheme
│   ├── context/
│   │   └── auth.tsx         # AuthProvider (onAuthStateChange, deep links, AppState)
│   └── lib/
│       ├── errors.ts        # Mapeo centralizado de errores Supabase a español
│       ├── password-rules.ts# Lógica de validación de complejidad de contraseñas
│       └── supabase.ts      # Cliente oficial Supabase con AsyncStorage y polyfill
├── .env.example             # Plantilla de variables de entorno
├── .env                     # Variables de entorno locales
├── app.json                 # Configuración de Expo y scheme "ibanktp"
├── DECISIONES.md            # Documento de decisiones de arquitectura y diseño
├── SUPABASE_CONFIG.md       # Guía de configuración del Dashboard de Supabase
└── tsconfig.json            # Configuración TypeScript con alias "@/..."
```

---

## Instalación y Puesta en Marcha

### 1. Clonar o descargar el repositorio
Ubicarse en el directorio raíz del proyecto:
```bash
cd LoginiBankSupabase
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copiar el archivo de ejemplo `.env.example` a `.env`:
```bash
cp .env.example .env
```
Editar el archivo `.env` y colocar las credenciales de tu proyecto de Supabase:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica-aqui
```
*(Para más detalles de cómo obtenerlas en el dashboard de Supabase, consultar [SUPABASE_CONFIG.md](SUPABASE_CONFIG.md)).*

### 4. Iniciar el servidor de desarrollo
```bash
npx expo start
```

Opciones de ejecución:
- **Expo Go (Android / iOS físico)**: Escanear el código QR que aparece en la terminal desde la app Expo Go.
- **Emulador Android**: Presionar `a` en la terminal (requiere Android Studio).
- **Simulador iOS**: Presionar `i` en la terminal (requiere macOS y Xcode).
- **Navegador Web**: Presionar `w` en la terminal.

---

## Reglas de Negocio Implementadas

### 1. Iniciar sesión (`/login`)
- **Habilitación reactiva**: El botón solo se habilita cuando el email tiene formato válido y la contraseña no está vacía (sin ocultar el botón).
- **Anti-enumeración**: Errores de credenciales inválidas devuelven un mensaje genérico *"Email o contraseña incorrectos"*, sin revelar si el usuario existe.
- **Email no confirmado**: Si el email aún no fue validado, redirige de forma fluida a `/confirm-pending`.
- **Rate limiting (429)**: Cooldown visual interactivo de 60 segundos visible en el botón antes de permitir un nuevo intento.
- **Estado de carga**: Inputs deshabilitados y botón con spinner (*"Iniciando sesión..."*) para prevenir doble envío.

### 2. Registro (`/register`)
- **Campos**: Nombre completo, Email, Contraseña, Confirmar contraseña y Checkbox de Términos y Condiciones.
- **Metadata**: El nombre se guarda automáticamente en `user_metadata.full_name`.
- **Checklist visual interactivo en tiempo real**:
  - [x] Mínimo 8 caracteres
  - [x] Al menos una mayúscula (A-Z)
  - [x] Al menos una minúscula (a-z)
  - [x] Al menos un número (0-9)
  - [x] Al menos un símbolo especial (`!@#$%^&*...`)
- **Confirmación estricta**: Validación de coincidencia idéntica entre contraseña y confirmación.
- **Anti-enumeración**: Si el correo ya existe, la UI muestra el mismo mensaje de éxito neutral (*"Revisá tu email para continuar"*).

### 3. Confirmación pendiente (`/confirm-pending`)
- Muestra el correo electrónico de destino en modo solo lectura.
- Botón *"Reenviar email"* con temporizador descendente de 60 segundos.
- Al abrir el deep link de confirmación (`ibanktp://confirm`), la app detecta la nueva sesión y navega automáticamente a Home.

### 4. Recuperar contraseña (`/forgot-password`)
- Validación de formato de correo.
- Envío con `Linking.createURL('reset-password')`.
- **Anti-enumeración estricta**: Muestra el mensaje unificado *"Si el email existe en nuestro sistema, vas a recibir instrucciones"* independientemente de si el correo existe o no en la base de datos.
- Cooldown de 60 segundos entre solicitudes sucesivas.

### 5. Nueva contraseña (`/reset-password`)
- Acceso restringido exclusivamente a través de enlaces de recuperación (`PASSWORD_RECOVERY`).
- **Protección contra enlaces inválidos o expirados**: Muestra una pantalla de error dedicada con opción de solicitar un nuevo enlace, **nunca** el formulario vacío por defecto.
- Mismo checklist de complejidad que en registro.
- Al confirmar el cambio: actualiza la clave en Supabase, cierra la sesión temporal de recuperación (`signOut`) y redirige a Login con banner de confirmación.

### 6. Pantalla Principal Protegida (`/home`)
- Acceso exclusivo para usuarios con sesión activa.
- Datos del usuario logueado (avatar con iniciales, nombre, email, fecha de registro y UUID).
- Tarjeta bancaria visual iBank Platinum con visualización/ocultamiento de saldo.
- Botón de cierre de sesión (`signOut`) que limpia el storage local y redirige a `/login`.

---

## Deep Links Soportados

El esquema configurado en `app.json` es `ibanktp`:
- `ibanktp://confirm`: Confirmación de cuenta nueva tras el registro.
- `ibanktp://reset-password`: Recuperación de contraseña para establecer una nueva clave.

Para probar deep links desde la terminal (Android):
```bash
npx uri-scheme open "ibanktp://reset-password" --android
```

---

## Documentación Adicional

- [DECISIONES.md](DECISIONES.md): Fundamentación de decisiones técnicas, análisis comparativo de persistencia (`AsyncStorage` vs `SecureStore`), mapeo de Figma y alcance.
- [SUPABASE_CONFIG.md](SUPABASE_CONFIG.md): Guía paso a paso de configuración del Dashboard de Supabase Auth (políticas de contraseñas, rate limits, emails y redirect URLs).
- [screenshots/](screenshots/): Capturas de pantalla oficiales de alta resolución de las 5 pantallas y los flujos de error/éxito más relevantes.

