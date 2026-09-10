import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Spacing } from '@/constants/theme'

export interface CheckboxProps {
  checked: boolean
  onToggle: (checked: boolean) => void
  label: React.ReactNode
  error?: string
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  error,
  disabled = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !disabled && onToggle(!checked)}
        disabled={disabled}
        style={styles.touchableArea}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
      >
        <View
          style={[
            styles.checkboxBox,
            checked && styles.checkboxBoxChecked,
            Boolean(error) && styles.checkboxBoxError,
            disabled && styles.checkboxBoxDisabled,
          ]}
        >
          {checked ? (
            <Ionicons name="checkmark" size={16} color={Colors.textInverse} />
          ) : null}
        </View>

        <View style={styles.labelContainer}>
          {typeof label === 'string' ? (
            <Text style={[styles.labelText, disabled && styles.labelDisabled]}>
              {label}
            </Text>
          ) : (
            label
          )}
        </View>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48, // Touch target accesible >= 48px
    paddingVertical: Spacing.xs,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    marginRight: Spacing.sm,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxBoxError: {
    borderColor: Colors.error,
  },
  checkboxBoxDisabled: {
    backgroundColor: Colors.inputDisabledBg,
    borderColor: '#CBD5E1',
  },
  labelContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  labelDisabled: {
    color: Colors.textMuted,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 2,
    marginLeft: 30,
  },
})
