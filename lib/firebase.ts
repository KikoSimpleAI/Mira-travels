// Centralized Firebase initialization with SSR-safe, lazy service getters.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import type { Auth } from "firebase/auth"

// IMPORTANT: Do not call getFirestore()/getStorage() during module evaluation.
// Initialize services lazily so SSR/import doesn't break.

let appInstance: FirebaseApp | undefined
let firestoreInstance: Firestore | undefined
let storageInstance: FirebaseStorage | undefined
let authInstance: Auth | undefined

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
    appInstance = getApps().length ? getApps()[0] : initializeApp(config)
  }
  return appInstance
}

export function getFirestoreDB(): Firestore {
  if (!firestoreInstance) {
    // This registers the Firestore service against the current app when first accessed.
    firestoreInstance = getFirestore(getFirebaseApp())
  }
  return firestoreInstance
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp())
  }
  return storageInstance
}

// Lazy, client-only Auth getter to avoid SSR registration issues.
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
  authInstance = a
  return a
}

// Optional compatibility export for modules importing { auth }.
// Will be undefined until getFirebaseAuth() is called on the client.
export { authInstance as auth }

// Export a lazy proxy so `import { db }` keeps working without eager init.
export const db: Firestore = new Proxy({} as Firestore, {
  get(_, prop: keyof Firestore) {
    const real = getFirestoreDB()
    // @ts-expect-error - dynamic property access
    return real[prop]
  },
}) as Firestore

// Export a lazy proxy for storage as well.
export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_, prop: keyof FirebaseStorage) {
    const real = getFirebaseStorage()
    // @ts-expect-error - dynamic property access
    return real[prop]
  },
}) as FirebaseStorage

// Keep a named export for the app for consumers expecting it.
export const app = getFirebaseApp()
