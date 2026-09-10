import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/auth'
import { Colors, Radius, Spacing } from '@/constants/theme'
import { Button } from '@/components/ui/Button'

export default function HomeScreen() {
  const { user, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'Usuario iBank'
  const email = user?.email || 'usuario@banco.com'
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Reciente'

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Superior con Datos de Usuario */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {fullName
                  .split(' ')
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Bienvenido,</Text>
              <Text style={styles.userNameText}>{fullName}</Text>
              <Text style={styles.userEmailText}>{email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notificationBtn}
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tarjeta Bancaria iBank Premium */}
        <View style={styles.bankCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardBrand}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.cardBrandText}>iBank Platinum</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsBalanceHidden(!isBalanceHidden)}
              accessibilityRole="button"
              accessibilityLabel={isBalanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
            >
              <Ionicons
                name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#E2E8F0"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
            <Text style={styles.balanceAmount}>
              {isBalanceHidden ? '••••••••' : '$ 1.250.450,00'}
            </Text>
          </View>

          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardNumberLabel}>Número de Cuenta</Text>
              <Text style={styles.cardNumber}>•••• 4829</Text>
            </View>
            <View style={styles.chipIcon}>
              <Ionicons name="hardware-chip-outline" size={28} color="#FFD700" />
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <Text style={styles.sectionTitle}>Operaciones Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="swap-horizontal" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="qr-code-outline" size={22} color={Colors.success} />
            </View>
            <Text style={styles.actionLabel}>Pagar QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="card-outline" size={22} color={Colors.warning} />
            </View>
            <Text style={styles.actionLabel}>Tarjetas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="receipt-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.actionLabel}>Servicios</Text>
          </TouchableOpacity>
        </View>

        {/* Estado de Seguridad y Autenticación Supabase */}
        <Text style={styles.sectionTitle}>Estado de Sesión</Text>
        <View style={styles.sessionStatusCard}>
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.statusTitle}>Autenticación Supabase Activa</Text>
          </View>
          <Text style={styles.statusDescription}>
            Sesión persistida con AsyncStorage y refresco de tokens automático en segundo plano.
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Miembro desde:</Text>
            <Text style={styles.metaValue}>{createdAt}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>ID de Usuario:</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {user?.id?.substring(0, 16)}...
            </Text>
          </View>
        </View>

        {/* Movimientos Recientes */}
        <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
        <View style={styles.transactionsCard}>
          <View style={styles.transactionItem}>
            <View style={[styles.transIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="arrow-down" size={18} color={Colors.success} />
            </View>
            <View style={styles.transInfo}>
              <Text style={styles.transTitle}>Transferencia Recibida</Text>
              <Text style={styles.transDate}>Hoy, 14:32 hs</Text>
            </View>
            <Text style={styles.transAmountPositive}>+ $ 120.000,00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.transactionItem}>
            <View style={[styles.transIconCircle, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="arrow-up" size={18} color={Colors.error} />
            </View>
            <View style={styles.transInfo}>
              <Text style={styles.transTitle}>Pago de Servicios — Luz</Text>
              <Text style={styles.transDate}>Ayer, 09:15 hs</Text>
            </View>
            <Text style={styles.transAmountNegative}>- $ 18.420,00</Text>
          </View>
        </View>

        {/* 7.3 Logout: supabase.auth.signOut() */}
        <Button
          title="Cerrar Sesión"
          variant="outline"
          loading={isLoggingOut}
          loadingText="Cerrando sesión..."
          leftIcon="log-out-outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '700',
  },
  welcomeText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.navyDark,
  },
  userEmailText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankCard: {
    backgroundColor: Colors.navyDark,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    shadowColor: Colors.navyDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cardBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBrandText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  balanceContainer: {
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumberLabel: {
    color: '#94A3B8',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
  },
  chipIcon: {
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navyDark,
    marginBottom: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconCircle: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  sessionStatusCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.navyDark,
    marginLeft: 8,
  },
  statusDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  transactionsCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  transIconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transInfo: {
    flex: 1,
  },
  transTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  transDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  transAmountPositive: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  transAmountNegative: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  logoutButton: {
    marginTop: Spacing.sm,
  },
})
