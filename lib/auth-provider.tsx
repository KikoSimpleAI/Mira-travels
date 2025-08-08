'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, type User } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"
import { getUserProfile, type UserProfile } from "@/lib/user"

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const unsubRef = useRef<() => void>()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const auth = await getFirebaseAuth()
        unsubRef.current = onAuthStateChanged(auth, async (u) => {
          if (!mounted) return
          setUser(u)
          if (u) {
            try {
              const profile = await getUserProfile(u.uid)
              setUserProfile(profile)
            } catch {
              setUserProfile(null)
            }
          } else {
            setUserProfile(null)
          }
          setLoading(false)
        })
      } catch {
        // If called on server by accident, keep loading false but no auth
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
      if (unsubRef.current) unsubRef.current()
    }
  }, [])

  const signInWithGoogle = async () => {
    const auth = await getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOut = async () => {
    const auth = await getFirebaseAuth()
    await firebaseSignOut(auth)
  }

  const value = useMemo(
    () => ({ user, userProfile, loading, signInWithGoogle, signOut }),
    [user, userProfile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
