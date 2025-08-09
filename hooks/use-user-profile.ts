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

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const ref = doc(db, "users", user.uid)

    // 1) Try network first
    try {
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile)
        setIsOffline(false)
        return
      }
      // Not found: create a default profile (works offline too due to local cache)
      const defaults = defaultsFor({ displayName: user.displayName, email: user.email })
      await setDoc(ref, defaults, { merge: true })
      setProfile(defaults)
      setIsOffline(false)
      return
    } catch {
      // 2) Network failed — fall back to cache
      try {
        const cached = await getDocFromCache(ref)
        if (cached.exists()) {
          setProfile(cached.data() as UserProfile)
          setIsOffline(true)
          return
        }
      } catch {
        // No cache either
      }
      setError("Offline and no cached profile available.")
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

  // Writes use setDoc({ merge: true }) so they queue when offline and sync later
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return false
      try {
        const ref = doc(db, "users", user.uid)
        await setDoc(ref, updates, { merge: true })
        setProfile((prev) => (prev ? { ...prev, ...updates } : (updates as UserProfile)))
        setError(null)
        return true
      } catch {
        setError("Failed to update profile.")
        return false
      }
    },
    [user],
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
    refreshProfile: loadProfile,
  }
}
