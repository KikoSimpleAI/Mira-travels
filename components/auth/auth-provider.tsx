"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getFirebaseAuth } from "@/lib/firebase"
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth"

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signInWithGoogle = async () => {
    setError(null)
    try {
      const auth = getFirebaseAuth()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (e: any) {
      setError(e?.message || "Failed to sign in with Google")
      throw e
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setError(null)
    try {
      const auth = getFirebaseAuth()
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      setError(e?.message || "Failed to sign in")
      throw e
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    setError(null)
    try {
      const auth = getFirebaseAuth()
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (cred.user && displayName) {
        await updateProfile(cred.user, { displayName })
      }
    } catch (e: any) {
      setError(e?.message || "Failed to sign up")
      throw e
    }
  }

  const signOutUser = async () => {
    setError(null)
    try {
      const auth = getFirebaseAuth()
      await signOut(auth)
    } catch (e: any) {
      setError(e?.message || "Failed to sign out")
      throw e
    }
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      signOutUser,
      signInWithEmail,
      signUpWithEmail,
    }),
    [user, loading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
