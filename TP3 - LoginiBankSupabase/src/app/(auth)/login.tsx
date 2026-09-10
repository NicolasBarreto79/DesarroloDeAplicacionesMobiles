import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { mapSupabaseError } from '@/lib/errors'
import { useAuth } from '@/context/auth'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AlertBanner } from '@/components/ui/AlertBanner'
import { AuthHeader } from '@/components/ui/AuthHeader'
import { AuthIllustration } from '@/components/ui/AuthIllustration'

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ message?: string }>()
  const { setPendingEmail } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState<number>(0)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const emailValue = watch('email')
  const passwordValue = watch('password')
  // 6.1 Email con formato válido y password no vacía habilitan el botón
  const isFormFilled = Boolean(emailValue?.trim()) && Boolean(passwordValue?.trim())
  const canSubmit = isFormFilled && isValid && !isLoading && cooldown === 0

  const onSubmit = async (values: LoginFormValues) => {
    if (isLoading || cooldown > 0) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      })

      if (error) {
        const mapped = mapSupabaseError(error)

        // 6.1 Email not confirmed -> Redirigir a confirmación pendiente
        if (mapped.isEmailNotConfirmed) {
          setPendingEmail(values.email.trim())
          router.push('/(auth)/confirm-pending')
          return
        }

        // 6.1 Error 429 (rate limit) -> Cooldown de 60 segundos
        if (mapped.isRateLimit) {
          setCooldown(60)
        }

        setErrorMessage(mapped.message)
        return
      }

      // Login exitoso: el auth provider detectará la sesión y redirigirá a /(app)/home
      if (data?.session) {
        router.replace('/(app)/home')
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado al conectar con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AuthHeader title="Sign In" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Rectangle 33: Hoja blanca con radio superior 30px según Figma */}
          <View style={styles.sheetContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Hello there, sign in to continue</Text>
            </View>

            {/* Ilustración de Figma con círculos de acento */}
            <AuthIllustration />

            {/* Banner de éxito opcional (ej: al volver de reset-password) */}
            {params.message ? (
              <AlertBanner type="success" message={params.message} />
            ) : null}

            {/* Banner de error / anti-enumeración */}
            {errorMessage ? (
              <AlertBanner type="error" message={errorMessage} />
            ) : null}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username or email"
                  placeholder="ejemplo@banco.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  leftIcon="mail-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  isPassword
                  leftIcon="lock-closed-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  disabled={isLoading}
                />
              )}
            />

            {/* Forgot your password ? */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              disabled={isLoading}
              style={styles.forgotPasswordButton}
              accessibilityRole="button"
              accessibilityLabel="Forgot your password?"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.forgotPasswordText}>Forgot your password ?</Text>
            </TouchableOpacity>

            {/* Botón Sign in con estados Figma (Primary / Dissable: #F2F1F9 -> Activo: #3629B7) */}
            <Button
              title="Sign in"
              loadingText="Iniciando sesión..."
              loading={isLoading}
              disabled={!canSubmit}
              cooldownSeconds={cooldown}
              onCooldownFinish={() => setCooldown(0)}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            />

            {/* Huella dactilar según Figma frame node-id=2-20347 */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.fingerprintContainer}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión con huella dactilar"
            >
              <View style={styles.fingerprintCircle}>
                <Ionicons name="finger-print" size={26} color={Colors.primary} />
              </View>
            </TouchableOpacity>

            {/* Footer: Don't have an account? Sign Up */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
                disabled={isLoading}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary, // #3629B7 fondo superior
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: Colors.sheetBg, // #FFFFFF (Rectangle 33)
    borderTopLeftRadius: Radius.sheet, // 30px
    borderTopRightRadius: Radius.sheet, // 30px
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    minHeight: '100%',
  },
  titleSection: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.title, // 24px SemiBold (Title / 1)
    lineHeight: 28,
    color: Colors.primary, // #3629B7
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.caption, // 12px Medium (Caption / 2)
    lineHeight: 16,
    color: Colors.text, // #343434 (Neutral / 1)
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.xs,
    marginBottom: Spacing.lg,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.caption, // 12px (Caption / 2)
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  submitButton: {
    marginBottom: Spacing.md,
  },
  fingerprintContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  fingerprintCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryLight, // #E5E2FF
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  footerText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.caption, // 12px (Text)
    lineHeight: 16,
    color: Colors.text, // #343434
  },
  signUpLink: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.caption, // 12px (Link)
    lineHeight: 16,
    color: Colors.primary, // #3629B7
  },
})
