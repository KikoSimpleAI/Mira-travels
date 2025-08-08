import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"
import { getFirestoreDB } from "@/lib/firebase"

export type TravelStyle = "Relaxation" | "Adventure" | "Culture" | "Food & Drink" | "Nightlife"
export type BudgetLevel = "Budget-Friendly" | "Mid-Range" | "Luxury"
export type Companions = "Solo" | "With a Partner" | "With Family" | "With Friends"
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
  usernameLower?: string | null
  photoURL?: string | null
  homeBase?: string | null
  bio?: string | null
  interests?: string[]
  preferences?: CorePreferences
  createdAt?: unknown
  updatedAt?: unknown
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
  const db = getFirestoreDB()
  const lower = username.toLowerCase()
  const q = query(collection(db, "users"), where("usernameLower", "==", lower))
  const snap = await getDocs(q)
  return snap.empty
}

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
    usernameLower: data.usernameLower ?? (data.username ? data.username.toLowerCase() : null),
    photoURL: data.photoURL ?? null,
    homeBase: data.homeBase ?? null,
    bio: data.bio ?? null,
    interests: data.interests ?? [],
    preferences: data.preferences ?? {},
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export async function upsertUserProfile(uid: string, patch: Partial<UserProfile>) {
  const db = getFirestoreDB()
  const ref = doc(db, "users", uid)
  const now = serverTimestamp()
  const payload: Record<string, unknown> = {
    uid,
    ...patch,
    updatedAt: now,
  }
  if (!(await getDoc(ref)).exists()) {
    payload.createdAt = now
  }
  if (patch.username) {
    payload.usernameLower = patch.username.toLowerCase()
  }
  await setDoc(ref, payload, { merge: true })
}

export async function getUserCorePreferences(uid: string): Promise<CorePreferences | null> {
  const profile = await getUserProfile(uid)
  return profile?.preferences ?? null
}

export async function upsertUserCorePreferences(uid: string, prefs: CorePreferences) {
  const db = getFirestoreDB()
  const ref = doc(db, "users", uid)
  await updateDoc(ref, { preferences: prefs, updatedAt: serverTimestamp() })
}
