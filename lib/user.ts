import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"
import { getFirebaseApp } from "./firebase"

export type UserProfile = {
  uid: string
  displayName: string
  username: string
  usernameLower: string
  photoURL?: string
  email?: string
  homeBase?: string
  bio?: string
  interests?: string[]
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
  const app = getFirebaseApp()
  const db = getFirestore(app)
  const lower = username.toLowerCase()
  const q = query(collection(db, "users"), where("usernameLower", "==", lower))
  const snap = await getDocs(q)
  return snap.empty
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const app = getFirebaseApp()
  const db = getFirestore(app)
  const ref = doc(db, "users", uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

export async function upsertUserProfile(profile: UserProfile): Promise<void> {
  const app = getFirebaseApp()
  const db = getFirestore(app)
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
