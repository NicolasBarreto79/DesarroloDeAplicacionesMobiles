import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { Session, User } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import { useRouter, useSegments } from 'expo-router'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  isRecoverySession: boolean
  pendingEmail: string
  setPendingEmail: (email: string) => void
  clearRecoverySession: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  isRecoverySession: false,
  pendingEmail: '',
  setPendingEmail: () => {},
  clearRecoverySession: () => {},
  signOut: async () => {},
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRecoverySession, setIsRecoverySession] = useState<boolean>(false)
  const [pendingEmail, setPendingEmailState] = useState<string>('')

  const router = useRouter()
  const segments = useSegments()

  const setPendingEmail = useCallback((email: string) => {
    setPendingEmailState(email)
  }, [])

  const clearRecoverySession = useCallback(() => {
    setIsRecoverySession(false)
  }, [])

  // 7.3 Logout: supabase.auth.signOut() limpia el storage local y vuelve a Login
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setSession(null)
      setIsRecoverySession(false)
    } catch (e) {
      // Regla 7.5: Nada sensible en logs
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 05 · Ciclo de vida de la app — refresh en foreground/background
  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh()
      } else {
        supabase.auth.stopAutoRefresh()
      }
    }

    const sub = AppState.addEventListener('change', handleAppStateChange)
    return () => {
      sub.remove()
    }
  }, [])

  // Helper para procesar URLs de Deep Linking (Supabase envía tokens en el hash # o query)
  const handleDeepLinkUrl = useCallback(async (url: string | null) => {
    if (!url) return

    try {
      // Supabase suele enviar fragmentos como: ibanktp://reset-password#access_token=...&refresh_token=...&type=recovery
      let paramsString = ''
      if (url.includes('#')) {
        paramsString = url.split('#')[1]
      } else if (url.includes('?')) {
        paramsString = url.split('?')[1]
      }

      if (paramsString) {
        const searchParams = new URLSearchParams(paramsString)
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const type = searchParams.get('type')

        if (accessToken && refreshToken) {
          if (type === 'recovery') {
            setIsRecoverySession(true)
          }
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (type === 'recovery') {
            router.replace('/(auth)/reset-password')
          }
        }
      }
    } catch {
      // En caso de link malformado, dejamos que los validadores manejen el estado
    }
  }, [router])

  // Inicialización de sesión y escuchas de Auth
  useEffect(() => {
    let isMounted = true

    // 1. Obtener sesión actual inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session)
        setIsLoading(false)
      }
    })

    // 2. Escuchar cambios de Auth (onAuthStateChange)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return

      setSession(newSession)
      setIsLoading(false)

      if (event === 'PASSWORD_RECOVERY') {
        // Regla 6.5: Hay una sesión temporal de recuperación: navegar al formulario
        setIsRecoverySession(true)
        router.replace('/(auth)/reset-password')
      } else if (event === 'SIGNED_IN') {
        // Si no es sesión de recovery, es un inicio de sesión regular
        if (!isRecoverySession) {
          setIsLoading(false)
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setIsRecoverySession(false)
      }
    })

    // 3. Capturar deep link inicial y eventos subsecuentes
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLinkUrl(url)
    })

    const linkingSub = Linking.addEventListener('url', (event) => {
      handleDeepLinkUrl(event.url)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
      linkingSub.remove()
    }
  }, [handleDeepLinkUrl, isRecoverySession, router])

  // 7.2 Rutas protegidas:
  // Con sesión válida, pantallas de autenticación quedan inaccesibles y redirigen a Home;
  // Sin sesión, las pantallas privadas redirigen a Login.
  useEffect(() => {
    if (isLoading) return

    const segs = segments as string[]
    const inAuthGroup = segs[0] === '(auth)'
    const currentScreen = segs[1] as string | undefined

    // Si está en pantalla de reset-password por recovery o confirm-pending, permitir acceso controlado
    if (inAuthGroup && (currentScreen === 'reset-password' || currentScreen === 'confirm-pending')) {
      return
    }

    if (session && inAuthGroup && !isRecoverySession) {
      // Si ya tiene sesión activa y está en login/register/forgot-password, va a home
      router.replace('/(app)/home')
    } else if (!session && segments[0] === '(app)') {
      // Si no tiene sesión e intenta entrar a app privada, va a login
      router.replace('/(auth)/login')
    }
  }, [session, isLoading, segments, isRecoverySession, router])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        isRecoverySession,
        pendingEmail,
        setPendingEmail,
        clearRecoverySession,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
