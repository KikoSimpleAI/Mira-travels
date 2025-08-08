'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User, getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth'
import { app } from '@/lib/firebase'
import { getUserProfile, UserProfile } from '@/lib/user'

const auth = getAuth(app)

interface AuthContextType {
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error signing in with Google", error)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  const value = { user, userProfile, loading, signInWithGoogle, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
