import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Spacing } from '@/constants/theme'
import { validatePasswordRules } from '@/lib/password-rules'

interface PasswordChecklistProps {
  password: string
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const rules = validatePasswordRules(password)
  const hasTyped = password.length > 0

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requisitos de seguridad:</Text>
      <View style={styles.list}>
        {rules.map((rule) => {
          const isValid = rule.valid
          const iconName = isValid
            ? 'checkmark-circle'
            : hasTyped
            ? 'close-circle-outline'
            : 'ellipse-outline'
          const iconColor = isValid
            ? Colors.success
            : hasTyped
            ? Colors.error
            : Colors.textMuted
          const textColor = isValid
            ? Colors.success
            : hasTyped
            ? Colors.textSecondary
            : Colors.textMuted

          return (
            <View key={rule.id} style={styles.itemRow}>
              <Ionicons
                name={iconName}
                size={16}
                color={iconColor}
                style={styles.icon}
              />
              <Text style={[styles.itemLabel, { color: textColor }]}>
                {rule.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
})
