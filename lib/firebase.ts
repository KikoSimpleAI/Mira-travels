// Centralized Firebase initialization with SSR-safe Auth handling

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import type { Auth } from "firebase/auth"

// NOTE: Do NOT import from "firebase/auth" at the module top-level.
// We'll dynamically import it in getFirebaseAuth() to avoid SSR registration issues.

let appInstance: FirebaseApp | undefined
let dbInstance: Firestore | undefined
let storageInstance: FirebaseStorage | undefined

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    if (!config.apiKey || !config.projectId) {
      console.warn("Firebase: missing NEXT_PUBLIC_FIREBASE_* environment variables.")
    }

    appInstance = getApps().length ? getApps()[0] : initializeApp(config)
  }
  return appInstance
}

export function getFirestoreDB(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp())
  }
  return dbInstance
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp())
  }
  return storageInstance
}

// Lazy, client-only Auth getter.
// Call this in client components before interacting with Auth.
export async function getFirebaseAuth(): Promise<Auth> {
  if (typeof window === "undefined") {
    throw new Error("getFirebaseAuth() must be called on the client")
  }
  const { getAuth, setPersistence, browserLocalPersistence } = await import("firebase/auth")
  const a = getAuth(getFirebaseApp())
  try {
    await setPersistence(a, browserLocalPersistence)
  } catch {
    // Ignore persistence errors (e.g., private mode)
  }
  // Keep the exported binding updated for compatibility with legacy imports
  auth = a
  return a
}

// Compatibility named export for modules that import { auth }.
// This will be set on the client after the first call to getFirebaseAuth()
// and pre-warmed below. On the server it remains undefined.
export let auth: Auth | undefined

// Named singletons for db and storage as many modules import these
export const db = getFirestoreDB()
export const storage = getFirebaseStorage()

// Named export for app to satisfy imports expecting it.
export const app = getFirebaseApp()

// Pre-warm the Auth singleton on the client so { auth } becomes available soon after import.
if (typeof window !== "undefined") {
  // Fire and forget; callers should still prefer getFirebaseAuth() for certainty.
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  getFirebaseAuth().catch(() => {})
}
