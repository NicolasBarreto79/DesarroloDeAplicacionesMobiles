# Configuración del Dashboard de Supabase

**TP3 — Flujo de Login Completo — iBank × Supabase**  
*Guía de configuración de seguridad en el panel de control de Supabase Auth*

---

## 1. Obtención de Credenciales de Conexión

1. Ingresá a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. Dirigite a **Project Settings** (ícono de engranaje) → **API**.
3. Copiá los siguientes valores en tu archivo `.env` local:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **Project API Keys (`anon` / `public`)** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

> [!CAUTION]
> **Seguridad de Claves**:
> Únicamente la clave **`anon` (public)** debe colocarse en la aplicación cliente. La clave **`service_role` (secret)** nunca debe incluirse ni exponerse en el código de React Native, ya que permite evadir todas las políticas de Row Level Security (RLS) y posee privilegios totales de administración.

---

## 2. Política de Seguridad de Contraseñas (Password Security)

Dirigite a **Authentication** → **Providers** → **Email** (o **Configuration** → **Password Security** según la interfaz de Supabase):

| Parámetro | Configuración Recomendada | Propósito |
| :--- | :--- | :--- |
| **Minimum password length** | **8 caracteres** (o superior) | Prevenir contraseñas cortas y débiles |
| **Require uppercase character** | **Activado (Yes)** | Exige al menos una letra mayúscula (A-Z) |
| **Require lowercase character** | **Activado (Yes)** | Exige al menos una letra minúscula (a-z) |
| **Require number (digit)** | **Activado (Yes)** | Exige al menos un número (0-9) |
| **Require special symbol** | **Activado (Yes)** | Exige al menos un símbolo (`!@#$%^&*...`) |
| **Prevent leaked passwords** | **Activado (Recomendado)** | Verifica contraseñas contra la base de datos de HaveIBeenPwned |

*Nota: La aplicación cliente `iBank` implementa en tiempo real estas mismas 5 reglas mediante el componente `PasswordChecklist` en Registro y Recuperación de Contraseña.*

---

## 3. Confirmación de Correo Electrónico (Confirm Email)

Dirigite a **Authentication** → **Providers** → **Email**:

1. Habilitá la casilla **"Enable Email Signup"**.
2. Habilitá la casilla **"Confirm email"**.
   - Con esta opción activa, cuando un usuario se registra mediante `signUp`, Supabase mantiene el usuario en estado no confirmado hasta que valida el enlace.
   - Si el usuario intenta iniciar sesión antes de confirmar, la API retorna el error `email_not_confirmed`, provocando que `iBank` lo redirija inmediatamente a la pantalla `/confirm-pending`.

---

## 4. Configuración de URLs de Redirección (Deep Linking)

Dirigite a **Authentication** → **URL Configuration**:

1. **Site URL**:
   Colocá la URL base de tu aplicación o esquema móvil:
   ```text
   ibanktp://confirm
   ```
2. **Redirect URLs (Allowlist)**:
   Agregá a la lista de URLs permitidas cada uno de los esquemas utilizados por la app:
   ```text
   ibanktp://confirm
   ibanktp://reset-password
   http://localhost:8081
   ```
   *(Incluir `http://localhost:8081` permite realizar pruebas locales si ejecutás la aplicación en entorno web).*

---

## 5. Plantillas de Correo Electrónico (Email Templates)

Dirigite a **Authentication** → **Email Templates**:

### A. Confirm signup (Confirmación de registro)
- **Subject**: `Confirmá tu cuenta de iBank`
- **Body**:
  ```html
  <h2>¡Bienvenido a iBank!</h2>
  <p>Hacé clic en el siguiente enlace para confirmar tu cuenta bancaria digital:</p>
  <p><a href="{{ .ConfirmationURL }}">Confirmar mi cuenta</a></p>
  ```

### B. Reset Password (Recuperación de contraseña)
- **Subject**: `Restablecimiento de contraseña — iBank`
- **Body**:
  ```html
  <h2>Solicitud de cambio de contraseña</h2>
  <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta iBank. Hacé clic en el enlace para ingresar tu nueva clave:</p>
  <p><a href="{{ .ConfirmationURL }}">Establecer nueva contraseña</a></p>
  <p>Si no realizaste esta solicitud, podés ignorar este correo de forma segura.</p>
  ```

---

## 6. Límites de Tasa (Rate Limits) y Expiración de Enlaces

Dirigite a **Authentication** → **Rate Limits**:

1. **Email rate limit**:
   - Por defecto: **60 segundos** por usuario para reintentos de envío de confirmación y restablecimiento de contraseña.
   - La aplicación `iBank` sincroniza este límite mostrando un cooldown de 60 segundos en los botones de "Reenviar email" y "Enviar Enlace".
2. **Link expiration (OTP / Magic Link validity)**:
   - Configurado en **3600 segundos (1 hora)** o menos. Si un usuario intenta acceder con un enlace vencido, la pantalla `/reset-password` presenta el estado de enlace expirado bloqueando el acceso.
