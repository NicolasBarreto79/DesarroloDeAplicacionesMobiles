import { AuthError } from '@supabase/supabase-js'

export interface MappedAuthError {
  code: string
  message: string
  isRateLimit: boolean
  isEmailNotConfirmed: boolean
}

/**
 * 7.4 Mapeo de errores centralizado
 * Traduce los códigos de error de Supabase a mensajes comprensibles en español
 * y respeta las reglas anti-enumeración de seguridad bancaria.
 */
export function mapSupabaseError(error: any): MappedAuthError {
  if (!error) {
    return {
      code: 'unknown',
      message: 'Ocurrió un error inesperado.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  const code = (error?.code || '').toLowerCase()
  const rawMessage = (error?.message || '').toLowerCase()
  const status = error?.status

  // 1. Rate limiting (429)
  if (
    code === 'over_request_rate_limit' ||
    status === 429 ||
    rawMessage.includes('rate limit') ||
    rawMessage.includes('too many requests')
  ) {
    return {
      code: 'over_request_rate_limit',
      message: 'Demasiados intentos. Por favor esperá unos momentos antes de reintentar.',
      isRateLimit: true,
      isEmailNotConfirmed: false,
    }
  }

  // 2. Email no confirmado
  if (code === 'email_not_confirmed' || rawMessage.includes('email not confirmed')) {
    return {
      code: 'email_not_confirmed',
      message: 'El correo electrónico aún no ha sido confirmado.',
      isRateLimit: false,
      isEmailNotConfirmed: true,
    }
  }

  // 3. Credenciales inválidas (Regla 6.1: Mensaje genérico anti-enumeración)
  if (
    code === 'invalid_credentials' ||
    code === 'invalid_grant' ||
    rawMessage.includes('invalid login credentials') ||
    rawMessage.includes('invalid credentials')
  ) {
    return {
      code: 'invalid_credentials',
      message: 'Email o contraseña incorrectos.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 4. Usuario ya existente (Regla 6.2: Neutral para no revelar existencia)
  if (
    code === 'user_already_exists' ||
    rawMessage.includes('user already registered') ||
    rawMessage.includes('already exists')
  ) {
    return {
      code: 'user_already_exists',
      message: 'Revisá tu email para continuar.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 5. Contraseña débil
  if (code === 'weak_password' || rawMessage.includes('password should be')) {
    return {
      code: 'weak_password',
      message: 'La contraseña no cumple con los criterios mínimos de seguridad.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 6. Token expirado o link inválido (Regla 6.5)
  if (
    code === 'otp_expired' ||
    code === 'token_expired' ||
    rawMessage.includes('expired') ||
    rawMessage.includes('invalid link') ||
    rawMessage.includes('token has expired')
  ) {
    return {
      code: 'link_expired',
      message: 'El enlace de recuperación ha expirado o es inválido. Por favor solicita uno nuevo.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 7. Errores de Red / Conexión
  if (
    rawMessage.includes('network') ||
    rawMessage.includes('failed to fetch') ||
    rawMessage.includes('network request failed') ||
    rawMessage.includes('abort')
  ) {
    return {
      code: 'network_error',
      message: 'Error de conexión. Verificá tu acceso a internet e intentá nuevamente.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // Mensaje por defecto en español
  return {
    code: code || 'auth_error',
    message: 'No pudimos procesar tu solicitud. Por favor verificá los datos e intentá de nuevo.',
    isRateLimit: false,
    isEmailNotConfirmed: false,
  }
}
