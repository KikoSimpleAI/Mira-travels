"use client"

import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from './use-auth'

export interface UserProfile {
  name: string
  email: string
  bio: string
  location: string
  travelStyle: 'explorer' | 'relaxer' | 'adventurer' | 'cultural' | 'budget'
  budget: 'budget' | 'moderate' | 'luxury'
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

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile)
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile: UserProfile = {
          name: user.displayName || 'User',
          email: user.email || '',
          bio: '',
          location: '',
          travelStyle: 'explorer',
          budget: 'moderate',
          interests: [],
          preferences: {
            rating: 80,
            safety: 70,
            cost: 60,
            climate: 50,
            activities: 70,
            walkability: 40
          },
          createdAt: new Date().toISOString()
        }
        
        await setDoc(docRef, defaultProfile)
        setProfile(defaultProfile)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return

    try {
      setError(null)
      
      const docRef = doc(db, 'users', user.uid)
      await updateDoc(docRef, updates)
      
      setProfile({ ...profile, ...updates })
      return true
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
      return false
    }
  }

  const updatePreferences = async (preferences: UserProfile['preferences']) => {
    return updateProfile({ preferences })
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePreferences,
    refreshProfile: loadProfile
  }
}
