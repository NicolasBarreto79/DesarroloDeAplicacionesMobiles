import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Spacing, Typography } from '@/constants/theme'

export interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: keyof typeof Ionicons.glyphMap
  isPassword?: boolean
  disabled?: boolean
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, isPassword, disabled = false, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            Boolean(error) && styles.inputWrapperError,
            disabled && styles.inputWrapperDisabled,
          ]}
        >
          {leftIcon ? (
            <Ionicons
              name={leftIcon}
              size={18}
              color={error ? Colors.error : isFocused ? Colors.primary : Colors.textMuted}
              style={styles.leftIcon}
            />
          ) : null}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              disabled && styles.inputDisabledText,
              style,
            ]}
            placeholderTextColor={Colors.textMuted} // #CACACA
            editable={!disabled}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            {...props}
          />

          {isPassword ? (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={disabled}
              style={styles.rightIcon}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    )
  }
)

Input.displayName = 'Input'

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  label: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.caption, // 12px Caption / 1
    lineHeight: 16,
    color: Colors.primary, // #3629B7
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder, // #CBCBCB
    borderRadius: Radius.input, // 15px
    paddingHorizontal: Spacing.md,
    height: 50, // Confortable y accesible (WCAG >= 48px, cercano a los 44px de Figma)
  },
  inputWrapperFocused: {
    borderWidth: 1.5,
    borderColor: Colors.inputFocusBorder, // #3629B7
    backgroundColor: '#FAFAFE',
  },
  inputWrapperError: {
    borderWidth: 1.5,
    borderColor: Colors.error, // #FF4267
    backgroundColor: Colors.errorLight,
  },
  inputWrapperDisabled: {
    backgroundColor: Colors.inputDisabledBg, // #F2F1F9
    borderColor: '#E2E2EA',
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    padding: 4,
    marginLeft: Spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.input, // 14px Body / 3
    color: Colors.text, // #343434
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  inputDisabledText: {
    color: Colors.textMuted,
  },
  errorText: {
    fontFamily: Typography.fontFamily.medium,
    color: Colors.error, // #FF4267
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
})
