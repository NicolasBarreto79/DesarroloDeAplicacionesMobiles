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
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { mapSupabaseError } from '@/lib/errors'
import { isPasswordStrong } from '@/lib/password-rules'
import { useAuth } from '@/context/auth'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AlertBanner } from '@/components/ui/AlertBanner'
import { AuthHeader } from '@/components/ui/AuthHeader'
import { PasswordChecklist } from '@/components/ui/PasswordChecklist'

const resetPasswordSchema = z
  .object({
    password: z.string().min(1, 'La contraseña es requerida'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordScreen() {
  const router = useRouter()
  const { isRecoverySession, clearRecoverySession, session } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const formValues = watch()
  const isPasswordValid = isPasswordStrong(formValues.password)
  const passwordsMatch =
    Boolean(formValues.password) &&
    formValues.password === formValues.confirmPassword

  const canSubmit = isPasswordValid && passwordsMatch && !isLoading

  const hasValidRecoveryAccess = isRecoverySession || Boolean(session)

  if (!hasValidRecoveryAccess) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <AuthHeader title="Reset Password" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sheetContainer}>
            <View style={styles.errorIconCircle}>
              <Ionicons name="alert-circle-outline" size={50} color={Colors.error} />
            </View>

            <Text style={styles.title}>Enlace vencido o inválido</Text>
            <Text style={styles.invalidSubtitle}>
              El enlace de recuperación ha expirado o no es válido. Los enlaces bancarios tienen una validez de 1 hora.
            </Text>

            <Button
              title="Solicitar nuevo enlace"
              variant="primary"
              onPress={() => router.replace('/(auth)/forgot-password')}
              leftIcon="refresh-outline"
              style={styles.actionButton}
            />

            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Volver a Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (isLoading || !canSubmit) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) {
        const mapped = mapSupabaseError(error)
        setErrorMessage(mapped.message)
        return
      }

      await supabase.auth.signOut()
      clearRecoverySession()

      router.replace({
        pathname: '/(auth)/login',
        params: {
          message: 'Tu contraseña fue restablecida exitosamente. Iniciá sesión con tus nuevas credenciales.',
        },
      })
    } catch {
      setErrorMessage('Ocurrió un error inesperado al actualizar la contraseña.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AuthHeader title="Reset Password" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sheetContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Nueva Contraseña</Text>
              <Text style={styles.subtitle}>
                Definí tu nueva clave de acceso para operar en iBank
              </Text>
            </View>

            {errorMessage ? (
              <AlertBanner type="error" message={errorMessage} />
            ) : null}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nueva contraseña"
                  placeholder="••••••••"
                  isPassword
                  leftIcon="lock-closed-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  disabled={isLoading}
                />
              )}
            />

            <PasswordChecklist password={formValues.password || ''} />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirmar nueva contraseña"
                  placeholder="••••••••"
                  isPassword
                  leftIcon="shield-checkmark-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={
                    formValues.confirmPassword && !passwordsMatch
                      ? 'Las contraseñas no coinciden'
                      : errors.confirmPassword?.message
                  }
                  disabled={isLoading}
                />
              )}
            />

            <Button
              title="Guardar Nueva Contraseña"
              loadingText="Actualizando..."
              loading={isLoading}
              disabled={!canSubmit}
              onPress={handleSubmit(onSubmit)}
              style={styles.actionButton}
            />

            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              disabled={isLoading}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Cancelar y Volver</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.sheetBg,
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    minHeight: '100%',
  },
  titleSection: {
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.title,
    lineHeight: 28,
    color: Colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.caption,
    lineHeight: 18,
    color: Colors.text,
  },
  errorIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  invalidSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  actionButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.caption,
    color: Colors.primary,
  },
})
