import {
  doc,
  setDoc,
  getDoc,
  getDocFromCache,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  type FirestoreError,
} from "firebase/firestore"
import { getFirebaseDb } from "./firebase"

export type TravelStyle =
  | "relaxation"
  | "adventure"
  | "culture"
  | "food_drink"
  | "nightlife"

export const TRAVEL_STYLE_OPTIONS: {
  value: TravelStyle
  label: string
  example: string
}[] = [
  {
    value: "relaxation",
    label: "Relaxation",
    example: "beaches, spas, quiet countryside",
  },
  {
    value: "adventure",
    label: "Adventure",
    example: "hiking, diving, off-the-beaten-path",
  },
  {
    value: "culture",
    label: "Culture",
    example: "museums, historical sites, city tours",
  },
  {
    value: "food_drink",
    label: "Food & Drink",
    example: "culinary tours, wine regions, restaurants",
  },
  {
    value: "nightlife",
    label: "Nightlife",
    example: "lively cities, festivals, clubs",
  },
]

export type BudgetLevel = "budget_friendly" | "mid_range" | "luxury"
export const BUDGET_OPTIONS: {
  value: BudgetLevel
  label: string
  example: string
}[] = [
  {
    value: "budget_friendly",
    label: "Budget-Friendly",
    example: "hostels, street food, free activities",
  },
  {
    value: "mid_range",
    label: "Mid-Range",
    example: "boutique hotels, casual dining, some paid tours",
  },
  {
    value: "luxury",
    label: "Luxury",
    example: "high-end resorts, fine dining, private guides",
  },
]

export type Companions = "solo" | "partner" | "family" | "friends"
export const COMPANION_OPTIONS: { value: Companions; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "partner", label: "With a Partner" },
  { value: "family", label: "With Family" },
  { value: "friends", label: "With Friends" },
]

export const KEY_INTERESTS: string[] = [
  "Beaches & Coastlines",
  "Mountains & Hiking",
  "Historical Sites",
  "Museums & Art",
  "Nature & Wildlife",
  "Shopping",
  "Remote & Quiet",
]

export type UserCorePreferences = {
  travelStyle: TravelStyle
  budget: BudgetLevel
  companions: Companions
  interests: string[] // multi-select from KEY_INTERESTS
}

export type UserProfile = {
  uid: string
  displayName: string
  username: string
  usernameLower: string
  photoURL?: string
  email?: string
  homeBase?: string
  bio?: string
  // Legacy interests and new preferences kept for compatibility
  interests?: string[]
  preferences?: UserCorePreferences
  createdAt?: any
  updatedAt?: any
}

export function usernameFromDisplayName(input?: string, fallback?: string) {
  const base = (input || fallback || "traveler")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
  return base.slice(0, 20) || "traveler"
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const db = getFirebaseDb()
  const lower = username.toLowerCase()
  const q = query(collection(db, "users"), where("usernameLower", "==", lower))
  const snap = await getDocs(q)
  return snap.empty
}

function isOfflineError(e: unknown) {
  const fe = e as Partial<FirestoreError> & { message?: string }
  return (
    fe?.code === "unavailable" ||
    fe?.code === "failed-precondition" ||
    (fe?.message && fe.message.toLowerCase().includes("offline"))
  )
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb()
  const ref = doc(db, "users", uid)
  try {
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return snap.data() as UserProfile
  } catch (e) {
    // If we're offline or the network transport is blocked,
    // try to serve from the local cache (if available).
    if (isOfflineError(e)) {
      try {
        const cached = await getDocFromCache(ref)
        if (!cached.exists()) return null
        return cached.data() as UserProfile
      } catch {
        // No cached data available
        return null
      }
    }
    throw e
  }
}

export async function upsertUserProfile(profile: UserProfile): Promise<void> {
  const db = getFirebaseDb()
  const ref = doc(db, "users", profile.uid)
  await setDoc(
    ref,
    {
      ...profile,
      usernameLower: profile.username.toLowerCase(),
      updatedAt: serverTimestamp(),
      createdAt: profile.createdAt || serverTimestamp(),
    },
    { merge: true }
  )
}

export async function getUserCorePreferences(
  uid: string
): Promise<UserCorePreferences | null> {
  const prof = await getUserProfile(uid)
  return prof?.preferences || null
}

export async function upsertUserCorePreferences(
  uid: string,
  prefs: UserCorePreferences
): Promise<void> {
  const db = getFirebaseDb()
  const ref = doc(db, "users", uid)
  await setDoc(
    ref,
    {
      preferences: {
        travelStyle: prefs.travelStyle,
        budget: prefs.budget,
        companions: prefs.companions,
        interests: Array.from(new Set(prefs.interests)).filter((x) =>
          KEY_INTERESTS.includes(x)
        ),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
