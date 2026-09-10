import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'

export type AlertType = 'error' | 'success' | 'warning' | 'info'

interface AlertBannerProps {
  type: AlertType
  message: string
  title?: string
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  message,
  title,
}) => {
  if (!message) return null

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: Colors.successLight,
          border: Colors.successBorder,
          text: '#0D7E69',
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          iconColor: Colors.success,
        }
      case 'warning':
        return {
          bg: Colors.warningLight,
          border: Colors.warningBorder,
          text: '#B46804',
          icon: 'warning' as keyof typeof Ionicons.glyphMap,
          iconColor: Colors.warning,
        }
      case 'info':
        return {
          bg: Colors.infoLight,
          border: Colors.infoBorder,
          text: '#066CC7',
          icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
          iconColor: Colors.info,
        }
      case 'error':
      default:
        return {
          bg: Colors.errorLight,
          border: Colors.errorBorder,
          text: '#C72445',
          icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
          iconColor: Colors.error,
        }
    }
  }

  const config = getConfig()

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}
      accessibilityRole="alert"
    >
      <Ionicons
        name={config.icon}
        size={20}
        color={config.iconColor}
        style={styles.icon}
      />
      <View style={styles.textWrapper}>
        {title ? (
          <Text style={[styles.title, { color: config.text }]}>{title}</Text>
        ) : null}
        <Text style={[styles.message, { color: config.text }]}>{message}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  icon: {
    marginRight: Spacing.sm,
    marginTop: 1,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 14,
    marginBottom: 2,
  },
  message: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
})
