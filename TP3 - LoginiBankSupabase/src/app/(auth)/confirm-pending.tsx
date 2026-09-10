import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { mapSupabaseError } from '@/lib/errors'
import { useAuth } from '@/context/auth'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'
import { Button } from '@/components/ui/Button'
import { AlertBanner } from '@/components/ui/AlertBanner'
import { AuthHeader } from '@/components/ui/AuthHeader'

export default function ConfirmPendingScreen() {
  const router = useRouter()
  const { pendingEmail, session } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState<number>(60)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      router.replace('/(app)/home')
    }
  }, [session, router])

  const emailToDisplay = pendingEmail || 'tu correo electrónico'

  const handleResendEmail = async () => {
    if (isLoading || cooldown > 0 || !pendingEmail) return

    setIsLoading(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: {
          emailRedirectTo: 'ibanktp://confirm',
        },
      })

      if (error) {
        const mapped = mapSupabaseError(error)
        if (mapped.isRateLimit) {
          setCooldown(60)
        }
        setErrorMessage(mapped.message)
        return
      }

      setCooldown(60)
      setStatusMessage('Hemos reenviado el enlace de confirmación a tu casilla de correo.')
    } catch {
      setErrorMessage('Ocurrió un error inesperado al reenviar el correo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <AuthHeader title="Confirm Email" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-unread-outline" size={44} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Confirmá tu correo</Text>
          <Text style={styles.subtitle}>
            Para proteger tu cuenta bancaria, enviamos un enlace de activación a:
          </Text>

          <View style={styles.emailContainer}>
            <Ionicons
              name="lock-closed"
              size={15}
              color={Colors.primary}
              style={styles.lockIcon}
            />
            <Text style={styles.emailText} numberOfLines={1}>
              {emailToDisplay}
            </Text>
          </View>

          {statusMessage ? (
            <AlertBanner type="success" message={statusMessage} />
          ) : null}

          {errorMessage ? (
            <AlertBanner type="error" message={errorMessage} />
          ) : null}

          <Text style={styles.instructionsText}>
            Hacé clic en el enlace dentro del correo para activar tu cuenta de iBank. Al
            confirmarlo, la app te dirigirá a tu banca automáticamente.
          </Text>

          <Button
            title="Reenviar email"
            variant="outline"
            loading={isLoading}
            loadingText="Reenviando correo..."
            cooldownSeconds={cooldown}
            onCooldownFinish={() => setCooldown(0)}
            onPress={handleResendEmail}
            disabled={!pendingEmail || cooldown > 0}
            leftIcon="refresh-outline"
            style={styles.resendButton}
          />

          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            disabled={isLoading}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Volver a Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
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
    paddingTop: 36,
    paddingBottom: 36,
    alignItems: 'center',
    minHeight: '100%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.title,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.caption,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDisabled,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    marginBottom: Spacing.lg,
    maxWidth: '100%',
  },
  lockIcon: {
    marginRight: Spacing.sm,
  },
  emailText: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 14,
    color: Colors.primary,
  },
  instructionsText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  resendButton: {
    width: '100%',
    marginBottom: Spacing.md,
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
