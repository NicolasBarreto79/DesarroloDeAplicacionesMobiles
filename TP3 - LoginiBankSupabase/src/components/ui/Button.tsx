import React, { useEffect, useState } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

export interface ButtonProps {
  title: string
  onPress?: () => void
  variant?: ButtonVariant
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  cooldownSeconds?: number
  onCooldownFinish?: () => void
  leftIcon?: keyof typeof Ionicons.glyphMap
  rightIcon?: keyof typeof Ionicons.glyphMap
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  accessibilityLabel?: string
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  loadingText,
  disabled = false,
  cooldownSeconds = 0,
  onCooldownFinish,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const [currentCooldown, setCurrentCooldown] = useState<number>(cooldownSeconds)

  useEffect(() => {
    setCurrentCooldown(cooldownSeconds)
  }, [cooldownSeconds])

  useEffect(() => {
    if (currentCooldown <= 0) return

    const timer = setInterval(() => {
      setCurrentCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (onCooldownFinish) onCooldownFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentCooldown, onCooldownFinish])

  const isButtonDisabled = disabled || loading || currentCooldown > 0

  const getVariantContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer
      case 'outline':
        return styles.outlineContainer
      case 'ghost':
        return styles.ghostContainer
      case 'danger':
        return styles.dangerContainer
      case 'primary':
      default:
        return styles.primaryContainer
    }
  }

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText
      case 'outline':
        return styles.outlineText
      case 'ghost':
        return styles.ghostText
      case 'danger':
        return styles.dangerText
      case 'primary':
      default:
        return styles.primaryText
    }
  }

  const getIconColor = () => {
    if (isButtonDisabled) return Colors.textMuted
    switch (variant) {
      case 'outline':
      case 'ghost':
        return Colors.primary
      case 'secondary':
        return Colors.text
      case 'danger':
      case 'primary':
      default:
        return Colors.textInverse
    }
  }

  const displayText = loading
    ? loadingText || 'Cargando...'
    : currentCooldown > 0
    ? `${title} (${currentCooldown}s)`
    : title

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isButtonDisabled}
      style={[
        styles.baseContainer,
        getVariantContainerStyle(),
        isButtonDisabled && styles.disabledContainer,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isButtonDisabled, busy: loading }}
    >
      <View style={styles.contentRow}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.textInverse}
            style={styles.spinner}
          />
        ) : leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        ) : null}

        <Text
          style={[
            styles.baseText,
            getVariantTextStyle(),
            isButtonDisabled && styles.disabledText,
            textStyle,
          ]}
        >
          {displayText}
        </Text>

        {!loading && rightIcon ? (
          <Ionicons
            name={rightIcon}
            size={18}
            color={getIconColor()}
            style={styles.rightIcon}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  baseContainer: {
    height: 50, // Confortable y accesible (WCAG >= 48px)
    borderRadius: Radius.button, // 15px según Figma Rectangle 43
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: Colors.primary, // #3629B7
  },
  secondaryContainer: {
    backgroundColor: Colors.primaryDisabled, // #F2F1F9
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  dangerContainer: {
    backgroundColor: Colors.error, // #FF4267
  },
  disabledContainer: {
    backgroundColor: Colors.primaryDisabled, // #F2F1F9 según Figma Dev Mode
    borderColor: Colors.primaryDisabled,
  },
  baseText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.button, // 16px Body / 1
    lineHeight: 24,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.textInverse, // #FFFFFF
  },
  secondaryText: {
    color: Colors.text,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.textInverse,
  },
  disabledText: {
    color: Colors.textMuted, // #CACACA según Figma
  },
  spinner: {
    marginRight: Spacing.sm,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
})
