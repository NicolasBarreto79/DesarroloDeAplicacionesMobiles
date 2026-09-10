import React from 'react'
import { Stack, Redirect } from 'expo-router'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useAuth } from '@/context/auth'
import { Colors } from '@/constants/theme'

export default function AppLayout() {
  const { session, isLoading } = useAuth()

  // 7.2 Mientras se resuelve la sesión, mostrar pantalla de carga (nunca parpadeo)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  // Si no hay sesión válida, redirigir a Login
  if (!session) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
})
