"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./use-auth"

export interface UserProfile {
  name: string
  email: string
  bio: string
  location: string
  travelStyle: "explorer" | "relaxer" | "adventurer" | "cultural" | "budget"
  budget: "budget" | "moderate" | "luxury"
  interests: string[]
  preferences: {
    rating: number
    safety: number
    cost: number
    climate: number
    activities: number
    walkability: number
  }
  createdAt: string
}

function defaultsFor(user: { displayName: string | null; email: string | null }): UserProfile {
  return {
    name: user.displayName || "User",
    email: user.email || "",
    bio: "",
    location: "",
    travelStyle: "explorer",
    budget: "moderate",
    interests: [],
    preferences: {
      rating: 80,
      safety: 70,
      cost: 60,
      climate: 50,
      activities: 70,
      walkability: 40,
    },
    createdAt: new Date().toISOString(),
  }
}

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState<boolean>(false)

  // Prevent repeated default creation loops
  const createdDefaultRef = useRef<boolean>(false)

  const ref = useMemo(() => {
    if (!user) return null
    return doc(db, "users", user.uid)
  }, [user])

  // Live, cache-first subscription — avoids "client is offline" errors
  useEffect(() => {
    setError(null)
    setIsOffline(false)
    createdDefaultRef.current = false

    if (!ref) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsub = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      async (snap) => {
        // Mark offline if this emission came from cache
        setIsOffline(snap.metadata.fromCache)

        if (snap.exists()) {
          setProfile(snap.data() as UserProfile)
          setLoading(false)
          return
        }

        // No document yet: create a default once (queues offline and syncs later)
        if (!createdDefaultRef.current && user) {
          createdDefaultRef.current = true
          try {
            const defaults = defaultsFor({ displayName: user.displayName, email: user.email })
            // merge:true ensures we don't override other fields if they were created elsewhere
            await setDoc(ref, defaults, { merge: true })
            // Optimistically update local state
            setProfile((prev) => prev ?? defaults)
          } catch {
            // If we're offline and persistence is active, setDoc will queue.
            // No need to surface an error; we'll keep showing empty/default UI until it syncs.
          }
        }
        setLoading(false)
      },
      (err) => {
        // Never throw — keep it in state for the UI
        setError("Unable to load profile right now.")
        setLoading(false)
      },
    )

    return () => unsub()
  }, [ref, user])

  // Writes use setDoc({ merge: true }) so they queue when offline and sync later
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!ref) return false
      try {
        await setDoc(ref, updates, { merge: true })
        setProfile((prev) => (prev ? { ...prev, ...updates } : (updates as UserProfile)))
        setError(null)
        return true
      } catch {
        setError("Failed to update profile.")
        return false
      }
    },
    [ref],
  )

  const updatePreferences = useCallback(
    async (preferences: UserProfile["preferences"]) => updateProfile({ preferences }),
    [updateProfile],
  )

  return {
    profile,
    loading,
    error,
    isOffline,
    updateProfile,
    updatePreferences,
    // expose a manual refresh that simply re-triggers the effect by toggling state
    refreshProfile: () => {
      // The onSnapshot is live; no-op provided for API parity
      return Promise.resolve()
    },
  }
}
