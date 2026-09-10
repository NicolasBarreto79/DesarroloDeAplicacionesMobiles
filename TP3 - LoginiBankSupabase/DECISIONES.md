# Documento de Decisiones Técnicas y de Diseño

**TP3 — Flujo de Login Completo — iBank × Supabase**  
*Licenciatura en Sistemas de Información — FCyT*

---

## 1. Mapeo del Diseño de Figma (iBank UI Kit — `node-id=2-20347`)

Para el desarrollo de la interfaz móvil se relevaron los valores exactos mediante **Figma Dev Mode** a partir del frame de partida oficial indicado por la consigna (**`node-id=2-20347`**, pantalla *Sign In* del archivo *iBank — Banking & E-Money Management App*).

### 1.1. Paleta de Colores Oficial (Figma Tokens)
- **Primary / 1 (`#3629B7`)**: Color corporativo principal de iBank. Utilizado en el fondo del header superior, títulos de pantalla (*"Welcome Back"*), etiquetas de inputs y botones de acción principal.
- **Primary / 2 (`#5655B9`)**: Tono complementario de la marca utilizado en detalles vectoriales e ilustraciones.
- **Primary / 4 (`#F2F1F9`)**: Utilizado para fondos suaves y estado *deshabilitado* de botones primarios (`Button / Primary / Dissable`).
- **Neutral / 1 (`#343434`)**: Texto principal y subtítulos descriptivos (*"Hello there, sign in to continue"* y *"Don't have an account?"*).
- **Neutral / 4 (`#CACACA` / `#CBCBCB`)**: Bordes de campos de texto (`border: 1px solid #CBCBCB`), textos de placeholder y textos pasivos.
- **Neutral / 6 (`#FFFFFF`)**: Fondo de la tarjeta principal inferior (`Rectangle 33`), texto de barra de navegación y textos de botones activos.
- **Acentos Semánticos / Ilustración**:
  - Lavanda (`#E5E2FF`): Círculo base de ilustración.
  - Coral / Error (`#FF4267`): Semantic / 1 para validaciones fallidas y bordes de error.
  - Celeste (`#0890FE`): Semantic / 2 para mensajes informativos.
  - Ámbar (`#FFAF2A`): Semantic / 3 para alertas preventivas y rate limits.
  - Verde Menta (`#52D5BA`): Semantic / 4 para validaciones exitosas.

### 1.2. Jerarquía y Tipografía Oficial (`Poppins`)
Se integró la familia tipográfica oficial **Poppins** (mediante `@expo-google-fonts/poppins`):
- **Title / 1**: 24px, SemiBold (600), line-height 28px (`#3629B7`) — Título *"Welcome Back"*.
- **Title / 2**: 20px, SemiBold (600), line-height 28px (`#FFFFFF`) — Barra de navegación superior (*Navigation Bar*).
- **Body / 1**: 16px, Medium (500), line-height 24px (`#FFFFFF` en activo, `#CACACA` en disabled) — Texto de botones principales.
- **Body / 3**: 14px, Medium (500), line-height 21px — Contenido de inputs y placeholders (`#CACACA`).
- **Caption / 1**: 12px, SemiBold (600), line-height 16px (`#3629B7`) — Labels superiores de cada input y enlaces (*"Sign Up"*).
- **Caption / 2**: 12px, Medium (500), line-height 16px (`#343434` / `#CACACA`) — Subtítulos y enlace *"Forgot your password ?"*.

### 1.3. Radios de Borde y Geometría
- **Hoja Principal (`Rectangle 33`)**: `border-radius: 30px 30px 0px 0px` para generar la transición visual distintiva entre el header azul y el contenido blanco.
- **Inputs (`Text field / Default`)**: `border-radius: 15px` con borde `1px solid #CBCBCB`.
- **Botones (`Rectangle 43`)**: `border-radius: 15px`.
- **Pills / Status Bar Handle**: `border-radius: 100px`.

### 1.4. Accesibilidad y Touch Targets
- Aunque Figma especifica 44px de altura para campos de texto, se ajustaron a **50px** para cumplir y superar el estándar de accesibilidad internacional **WCAG 2.1 (touch target mínimo >= 48px)** exigido por la sección 10 del TP, manteniendo intactos los radios de 15px y proporciones estéticas.

### 1.5. Estados Relevados del Kit
- **Inputs**:
  - *Vacío*: fondo blanco, borde `#CBCBCB`, placeholder `#CACACA`.
  - *Foco*: fondo sutil `#FAFAFE`, borde `#3629B7`.
  - *Error*: fondo `#FFF0F3`, borde `#FF4267`, mensaje inferior en rojo semántico.
  - *Deshabilitado*: fondo `#F2F1F9`, borde `#E2E2EA`, texto `#CACACA`.
- **Botones**:
  - *Activo*: fondo `#3629B7`, texto `#FFFFFF`.
  - *Deshabilitado*: fondo `#F2F1F9`, texto `#CACACA`.
  - *Cargando*: spinner activo centrado con texto dinámico.
  - *Rate limit*: cuenta regresiva visual en segundos con deshabilitación temporal reactiva.

---

## 2. Adaptaciones Realizadas y Justificación

Durante la integración con la lógica de negocio y las APIs de Supabase Auth, se implementaron adaptaciones específicas:

1. **Checklist Visual de Contraseña en Tiempo Real**:
   - *Decisión*: En lugar de arrojar un error estático luego de presionar "Crear Cuenta", se implementó el componente `PasswordChecklist` que evalúa dinámicamente cada una de las 5 reglas de complejidad exigidas por el banco mientras el usuario teclea.
   - *Justificación*: Reduce la frustración del usuario al registrarse y asegura el cumplimiento estricto de las políticas de seguridad del dashboard antes de disparar la petición de red.

2. **Temporizador de Cooldown en Botones**:
   - *Decisión*: Incorporar una cuenta regresiva visual dentro del componente `Button` (ej: *"Reenviar email (45s)"*) cuando se detecta un error de rate limit (429) o tras el envío de confirmación/recuperación.
   - *Justificación*: Evita peticiones repetitivas innecesarias que saturen la API o bloqueen la IP del cliente bancario.

3. **Guarda de Recuperación de Contraseña Vencida**:
   - *Decisión*: En la pantalla `/reset-password`, si no se detecta un evento legítimo de `PASSWORD_RECOVERY` o el token expiró, la aplicación presenta una vista de error dedicada indicando que el enlace es inválido, ofreciendo un botón para solicitar uno nuevo.
   - *Justificación*: Previene que un usuario interactúe con un formulario de cambio de contraseña sin una sesión temporal autorizada.

---

## 3. Elementos Fuera de Alcance

Conforme a la sección 01 de la consigna del TP:
- **Login Social (OAuth con Google, Apple, etc.)**: Queda excluido para focalizar la evaluación en el flujo estricto de credenciales bancarias.
- **Verificación en Dos Pasos (MFA / 2FA por SMS o TOTP)**: Excluido de la entrega obligatoria.
- **Biometría Local / FaceID / PIN**: Fuera del alcance funcional de esta entrega (foco 100% en Supabase Auth y validaciones de interfaz).

---

## 4. Evaluación Técnica: `AsyncStorage` vs `expo-secure-store`

Uno de los puntos clave del trabajo consistió en analizar el mecanismo de persistencia para las credenciales y sesiones de Supabase Auth en React Native.

### Tabla Comparativa

| Criterio | `@react-native-async-storage/async-storage` | `expo-secure-store` |
| :--- | :--- | :--- |
| **Ubicación de Almacenamiento** | SQLite / Archivos locales no cifrados | iOS Keychain / Android Keystore (Cifrado por hardware) |
| **Límite de Tamaño de Valor** | Sin límite estricto de tamaño | **Límite máximo de 2048 bytes (2 KB) en Android** |
| **Compatibilidad con Supabase JS v2** | **Nativa y recomendada oficialmente en los quickstarts** | Requiere adaptador personalizado |
| **Riesgo de Truncamiento / Crash** | Ninguno (almacena objetos JSON de sesión completos) | **Alto en tokens JWT enriquecidos o usuarios con mucha metadata** |
| **Rendimiento de Lectura/Escritura** | Rápido, no bloqueante | Ligeramente más lento debido a des/encriptación criptográfica |

### Análisis y Elección Fundamentada

1. **Recomendación Oficial de Supabase**:
   La documentación oficial de Supabase para React Native ([supabase.com/docs/guides/auth/quickstarts/react-native](https://supabase.com/docs/guides/auth/quickstarts/react-native)) recomienda explícitamente el uso de `@react-native-async-storage/async-storage` como storage engine por defecto:
   ```ts
   import AsyncStorage from '@react-native-async-storage/async-storage'
   export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
     auth: {
       storage: AsyncStorage,
       autoRefreshToken: true,
       persistSession: true,
       detectSessionInUrl: false,
     },
   })
   ```

2. **El Problema del Límite de 2048 bytes en Android**:
   `expo-secure-store` almacena los valores en las `SharedPreferences` protegidas con la clave maestra de Android Keystore. Este sistema impone un límite rígido de **2 KB (2048 bytes)** por clave. El objeto de sesión completo devuelto por Supabase incluye:
   - `access_token` (JWT con cabecera, payload y firma)
   - `refresh_token`
   - Objeto `user` con `app_metadata` y `user_metadata` (nombres, teléfonos, roles, etc.)
   Si el payload del JWT o la metadata del usuario supera los 2048 bytes, `expo-secure-store` arroja una excepción no controlada (`Key size or value exceeds maximum storage limit`), provocando el cierre inesperado de la aplicación en dispositivos Android.

3. **Conclusión**:
   Se adoptó **`@react-native-async-storage/async-storage`** para garantizar la estabilidad operativa del 100% de los usuarios en cualquier versión de Android e iOS, mitigando riesgos de seguridad a nivel aplicación mediante:
   - Exclusión estricta de credenciales en logs (`console.log`).
   - Cierre de sesión explícito (`signOut`) al cambiar contraseñas o desconectarse.
   - Restricción de permisos y almacenamiento en el sandbox privado de la aplicación.
