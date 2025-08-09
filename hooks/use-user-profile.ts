"use client"

import { useState, useEffect, useCallback } from "react"
import { doc, getDoc, getDocFromCache, setDoc } from "firebase/firestore"
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

function defaultProfileFor(user: { displayName: string | null; email: string | null }): UserProfile {
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState<boolean>(false)

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const ref = doc(db, "users", user.uid)

    // Try network first
    try {
      const snapshot = await getDoc(ref)
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile)
        setIsOffline(false)
        return
      }
      // Create a default profile if not present (works offline as queued write)
      const defaults = defaultProfileFor({ displayName: user.displayName, email: user.email })
      await setDoc(ref, defaults, { merge: true })
      setProfile(defaults)
      setIsOffline(false)
      return
    } catch (e) {
      // Network failure — fall back to cache
      try {
        const cached = await getDocFromCache(ref)
        if (cached.exists()) {
          setProfile(cached.data() as UserProfile)
          setIsOffline(true)
          return
        }
      } catch {
        // no cached data either
      }
      setError("Failed to load profile (offline and no cached data).")
      setIsOffline(true)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    void loadProfile()
  }, [user, loadProfile])

  // Resilient update that works offline (queued writes)
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return false
      try {
        const ref = doc(db, "users", user.uid)
        await setDoc(ref, updates, { merge: true }) // setDoc with merge queues writes offline too
        setProfile((prev) => (prev ? { ...prev, ...updates } : (updates as UserProfile)))
        setError(null)
        return true
      } catch (e) {
        setError("Failed to update profile")
        return false
      }
    },
    [user],
  )

  const updatePreferences = useCallback(
    async (preferences: UserProfile["preferences"]) => {
      return updateProfile({ preferences })
    },
    [updateProfile],
  )

  return {
    profile,
    loading,
    error,
    isOffline,
    updateProfile,
    updatePreferences,
    refreshProfile: loadProfile,
  }
}
