import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Colors, Spacing, Typography } from '@/constants/theme'

interface AuthHeaderProps {
  title: string
  showBackButton?: boolean
  onBackPress?: () => void
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  const router = useRouter()

  const handleBack = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      router.back()
    }
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSlot}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textInverse} />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.headerTitle}>{title}</Text>

      <View style={styles.rightSlot} />
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  leftSlot: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.navTitle, // 20px
    lineHeight: 28,
    color: Colors.textInverse, // #FFFFFF
    textAlign: 'center',
  },
  rightSlot: {
    width: 40,
  },
})
