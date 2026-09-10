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
import * as Linking from 'expo-linking'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { mapSupabaseError } from '@/lib/errors'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AlertBanner } from '@/components/ui/AlertBanner'
import { AuthHeader } from '@/components/ui/AuthHeader'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Formato de email inválido'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordScreen() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState<number>(0)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const emailValue = watch('email')
  const canSubmit = Boolean(emailValue?.trim()) && isValid && !isLoading && cooldown === 0

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    if (isLoading || cooldown > 0) return

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const redirectTo = Linking.createURL('reset-password')

      const { error } = await supabase.auth.resetPasswordForEmail(values.email.trim(), {
        redirectTo,
      })

      if (error) {
        const mapped = mapSupabaseError(error)
        if (mapped.isRateLimit) {
          setCooldown(60)
          setErrorMessage(mapped.message)
          return
        }
      }

      setCooldown(60)
      setSuccessMessage(
        'Si el email existe en nuestro sistema, vas a recibir instrucciones para restablecer tu contraseña.'
      )
    } catch {
      setCooldown(60)
      setSuccessMessage(
        'Si el email existe en nuestro sistema, vas a recibir instrucciones para restablecer tu contraseña.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AuthHeader title="Forgot Password" showBackButton />

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
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter the email associated with your bank account to receive instructions.
              </Text>
            </View>

            {successMessage ? (
              <AlertBanner type="info" message={successMessage} />
            ) : null}

            {errorMessage ? (
              <AlertBanner type="error" message={errorMessage} />
            ) : null}

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

            <Button
              title="Send Instructions"
              loadingText="Enviando..."
              loading={isLoading}
              disabled={!canSubmit}
              cooldownSeconds={cooldown}
              onCooldownFinish={() => setCooldown(0)}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            />

            <View style={styles.footerRow}>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                disabled={isLoading}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>← Volver a Sign In</Text>
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
    marginBottom: Spacing.lg,
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
  submitButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  footerRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.caption,
    color: Colors.primary,
  },
})
