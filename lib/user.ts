import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

// Core profile type persisted in Firestore at users/{uid}
export type TravelStyle =
  | "Relaxation"
  | "Adventure"
  | "Culture"
  | "Food & Drink"
  | "Nightlife"

export type BudgetLevel =
  | "Budget-Friendly"
  | "Mid-Range"
  | "Luxury"

export type Companions =
  | "Solo"
  | "With a Partner"
  | "With Family"
  | "With Friends"

export type CoreInterest =
  | "Beaches & Coastlines"
  | "Mountains & Hiking"
  | "Historical Sites"
  | "Museums & Art"
  | "Nature & Wildlife"
  | "Shopping"
  | "Remote & Quiet"

export interface CorePreferences {
  travelStyle?: TravelStyle | null
  budget?: BudgetLevel | null
  companions?: Companions | null
  interests?: CoreInterest[]
}

export interface UserProfile {
  uid: string
  email?: string | null
  displayName?: string | null
  username?: string | null
  photoURL?: string | null
  homeBase?: string | null
  bio?: string | null
  interests?: string[] // legacy/root-level interests if used by UI
  preferences?: CorePreferences
  createdAt?: unknown
  updatedAt?: unknown
}

// Fetch a user's profile. Returns null if not found.
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestoreDB()
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data() as Partial<UserProfile>
  return {
    uid,
    email: data.email ?? null,
    displayName: data.displayName ?? null,
    username: data.username ?? null,
    photoURL: data.photoURL ?? null,
    homeBase: data.homeBase ?? null,
    bio: data.bio ?? null,
    interests: data.interests ?? [],
    preferences: data.preferences ?? {},
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

// Create or update the whole profile atomically.
export async function upsertUserProfile(uid: string, patch: Partial<UserProfile>) {
  const db = getFirestoreDB()
  const ref = doc(db, "users", uid)
  const now = serverTimestamp()
  await setDoc(
    ref,
    {
      uid,
      ...patch,
      updatedAt: now,
      createdAt: now,
    },
    { merge: true }
  )
}

// Smaller helpers specifically for the “core preferences” feature.
export async function getUserCorePreferences(uid: string): Promise<CorePreferences | null> {
  const profile = await getUserProfile(uid)
  return profile?.preferences ?? null
}

export async function upsertUserCorePreferences(uid: string, prefs: CorePreferences) {
  const db = getFirestoreDB()
  const ref = doc(db, "users", uid)
  await updateDoc(ref, {
    preferences: prefs,
    updatedAt: serverTimestamp(),
  })
}
