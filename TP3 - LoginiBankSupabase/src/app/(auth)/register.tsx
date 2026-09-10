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
import { supabase } from '@/lib/supabase'
import { mapSupabaseError } from '@/lib/errors'
import { isPasswordStrong } from '@/lib/password-rules'
import { useAuth } from '@/context/auth'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { AlertBanner } from '@/components/ui/AlertBanner'
import { AuthHeader } from '@/components/ui/AuthHeader'
import { PasswordChecklist } from '@/components/ui/PasswordChecklist'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Ingresá tu nombre completo'),
    email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'Debés aceptar los Términos y Condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterScreen() {
  const router = useRouter()
  const { setPendingEmail } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  })

  const formValues = watch()
  const isPasswordValid = isPasswordStrong(formValues.password)
  const passwordsMatch =
    Boolean(formValues.password) &&
    formValues.password === formValues.confirmPassword

  const canSubmit =
    Boolean(formValues.fullName?.trim()) &&
    Boolean(formValues.email?.trim()) &&
    isPasswordValid &&
    passwordsMatch &&
    formValues.termsAccepted &&
    !isLoading

  const onSubmit = async (values: RegisterFormValues) => {
    if (isLoading || !canSubmit) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            full_name: values.fullName.trim(),
          },
          // Redirige al scheme configurado de la app
          emailRedirectTo: 'ibanktp://confirm',
        },
      })

      if (error) {
        const mapped = mapSupabaseError(error)
        setErrorMessage(mapped.message)
        return
      }

      // 6.2 Anti-enumeración y navegación a confirmación
      setPendingEmail(values.email.trim())
      router.push('/(auth)/confirm-pending')
    } catch {
      setErrorMessage('Ocurrió un error inesperado al registrar la cuenta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AuthHeader title="Sign Up" showBackButton />

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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Complete your details to get started with iBank
              </Text>
            </View>

            {errorMessage ? (
              <AlertBanner type="error" message={errorMessage} />
            ) : null}

            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="Juan Pérez"
                  autoCapitalize="words"
                  leftIcon="person-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email address"
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
                  disabled={isLoading}
                />
              )}
            />

            {/* Checklist reactivo en tiempo real */}
            <PasswordChecklist password={formValues.password || ''} />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm password"
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

            <Controller
              control={control}
              name="termsAccepted"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  checked={value}
                  onToggle={onChange}
                  disabled={isLoading}
                  error={errors.termsAccepted?.message}
                  label={
                    <Text style={styles.termsText}>
                      Acepto los{' '}
                      <Text style={styles.termsHighlight}>
                        Términos y Condiciones
                      </Text>{' '}
                      de iBank y la Política de Privacidad bancaria.
                    </Text>
                  }
                />
              )}
            />

            <Button
              title="Sign Up"
              loadingText="Creando cuenta..."
              loading={isLoading}
              disabled={!canSubmit}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿Ya tenés una cuenta? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                disabled={isLoading}
              >
                <Text style={styles.loginLink}>Sign In</Text>
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
    fontSize: Typography.sizes.title, // 24px
    lineHeight: 28,
    color: Colors.primary, // #3629B7
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.caption, // 12px
    lineHeight: 16,
    color: Colors.text,
  },
  termsText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  termsHighlight: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
  },
  submitButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.caption,
    color: Colors.text,
  },
  loginLink: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.caption,
    color: Colors.primary,
  },
})
