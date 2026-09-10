import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'

export const AuthIllustration: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Círculo central lavanda (#E5E2FF) con candado de Figma */}
      <View style={styles.mainCircle}>
        <Ionicons name="lock-closed" size={46} color={Colors.primary} />
      </View>

      {/* Círculos de acento semánticos del kit iBank */}
      <View style={[styles.dot, styles.dotPrimary]} />
      <View style={[styles.dot, styles.dotCoral]} />
      <View style={[styles.dot, styles.dotSky]} />
      <View style={[styles.dot, styles.dotAmber]} />
      <View style={[styles.dot, styles.dotMint]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 110,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  mainCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primaryLight, // #E5E2FF (Ellipse 1)
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
  },
  dotPrimary: {
    width: 10,
    height: 10,
    backgroundColor: Colors.primary, // #3629B7 (Ellipse 2)
    top: 4,
    left: 26,
  },
  dotCoral: {
    width: 16,
    height: 16,
    backgroundColor: Colors.error, // #FF4267 (Ellipse 3)
    top: 10,
    right: 22,
  },
  dotSky: {
    width: 8,
    height: 8,
    backgroundColor: Colors.info, // #0890FE (Ellipse 4)
    bottom: 12,
    right: 26,
  },
  dotAmber: {
    width: 14,
    height: 14,
    backgroundColor: Colors.warning, // #FFAF2A (Ellipse 5)
    bottom: 8,
    left: 20,
  },
  dotMint: {
    width: 8,
    height: 8,
    backgroundColor: Colors.success, // #52D5BA (Ellipse 6)
    top: 45,
    left: 10,
  },
})
