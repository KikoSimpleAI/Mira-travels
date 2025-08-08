'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { User, Auth } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const authRef = useRef<Auth | null>(null)

  // Initialize Auth lazily and subscribe once ready
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let mounted = true

    ;(async () => {
      try {
        const auth = await getFirebaseAuth()
        if (!mounted) return
        authRef.current = auth
        const { onIdTokenChanged } = await import('firebase/auth')
        unsubscribe = onIdTokenChanged(auth, (u) => {
          setUser(u)
          setLoading(false)
        })
      } catch (err) {
        // If auth cannot initialize (e.g., SSR), keep loading false but no user
        console.warn('Auth init failed:', err)
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const auth = authRef.current ?? (await getFirebaseAuth())
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const auth = authRef.current ?? (await getFirebaseAuth())
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName })
    }
  }

  const signInWithGoogle = async () => {
    const auth = authRef.current ?? (await getFirebaseAuth())
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    const auth = authRef.current ?? (await getFirebaseAuth())
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }

  const resetPassword = async (email: string) => {
    const auth = authRef.current ?? (await getFirebaseAuth())
    const { sendPasswordResetEmail } = await import('firebase/auth')
    await sendPasswordResetEmail(auth, email)
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    const a = authRef.current ?? (await getFirebaseAuth())
    if (!a.currentUser) return
    const { updateProfile } = await import('firebase/auth')
    await updateProfile(a.currentUser, { displayName, photoURL })
    // reflect updates immediately in local state
    setUser({ ...a.currentUser })
  }

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
