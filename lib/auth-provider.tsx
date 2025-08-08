'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"
import { upsertUserProfile, getUserProfile, type UserProfile } from "@/lib/user"

type AuthContextType = {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  // auth actions
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserDisplay: (displayName: string, photoURL?: string) => Promise<void>
  signOut: () => Promise<void>
  // token
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const unsubAuth = useRef<() => void>()
  const unsubToken = useRef<() => void>()
  const tokenRefreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const auth = await getFirebaseAuth()

        // Subscribe to auth state
        unsubAuth.current = onAuthStateChanged(auth, async (u) => {
          if (!mounted) return
          setUser(u)
          if (u) {
            // fetch or create user profile document
            try {
              const existing = await getUserProfile(u.uid)
              if (!existing) {
                await upsertUserProfile(u.uid, {
                  uid: u.uid,
                  email: u.email ?? undefined,
                  displayName: u.displayName ?? undefined,
                  photoURL: u.photoURL ?? undefined,
                })
                setUserProfile({
                  uid: u.uid,
                  email: u.email,
                  displayName: u.displayName,
                  photoURL: u.photoURL,
                  interests: [],
                  preferences: {},
                })
              } else {
                setUserProfile(existing)
              }
            } catch {
              setUserProfile(null)
            }
            // start foreground token refresh (every ~50 mins)
            if (tokenRefreshTimer.current) clearInterval(tokenRefreshTimer.current)
            tokenRefreshTimer.current = setInterval(async () => {
              try {
                await u.getIdToken(true)
              } catch {
                // ignore transient errors
              }
            }, 50 * 60 * 1000)
          } else {
            setUserProfile(null)
            if (tokenRefreshTimer.current) {
              clearInterval(tokenRefreshTimer.current)
              tokenRefreshTimer.current = null
            }
          }
          setLoading(false)
        })

        // react to token changes (custom claims, etc.)
        unsubToken.current = onIdTokenChanged(auth, async (u) => {
          if (!mounted) return
          setUser(u)
        })
      } catch {
        setLoading(false)
      }
    })()

    return () => {
      if (unsubAuth.current) unsubAuth.current()
      if (unsubToken.current) unsubToken.current()
      if (tokenRefreshTimer.current) clearInterval(tokenRefreshTimer.current)
    }
  }, [])

  const signInWithGoogle = async () => {
    const auth = await getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signInWithEmail = async (email: string, password: string) => {
    const auth = await getFirebaseAuth()
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    const auth = await getFirebaseAuth()
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    await upsertUserProfile(cred.user.uid, {
      uid: cred.user.uid,
      email: cred.user.email ?? undefined,
      displayName: cred.user.displayName ?? displayName ?? undefined,
      photoURL: cred.user.photoURL ?? undefined,
    })
  }

  const resetPassword = async (email: string) => {
    const auth = await getFirebaseAuth()
    await sendPasswordResetEmail(auth, email)
  }

  const updateUserDisplay = async (displayName: string, photoURL?: string) => {
    const auth = await getFirebaseAuth()
    if (!auth.currentUser) return
    await updateProfile(auth.currentUser, { displayName, photoURL })
    setUser({ ...auth.currentUser })
    if (userProfile) {
      await upsertUserProfile(userProfile.uid, { displayName, photoURL })
      setUserProfile({ ...userProfile, displayName, photoURL })
    }
  }

  const signOut = async () => {
    const auth = await getFirebaseAuth()
    await firebaseSignOut(auth)
  }

  const getIdToken = async (forceRefresh?: boolean) => {
    const auth = await getFirebaseAuth()
    if (!auth.currentUser) return null
    return auth.currentUser.getIdToken(!!forceRefresh)
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      updateUserDisplay,
      signOut,
      getIdToken,
    }),
    [user, userProfile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
