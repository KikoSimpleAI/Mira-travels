// Centralized, production-stable Firebase bootstrap for Next.js App Router.
// - Single app instance
// - Lazy, client-only Auth getter (prevents SSR "Component auth has not been registered yet")
// - Lazy Firestore/Storage getters (prevents "Service firestore is not available")
// - Optional compatibility exports for { app }, { db }, { storage }

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import type { Auth } from "firebase/auth"

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

// Lazy, client-only Auth getter to avoid SSR issues
export async function getFirebaseAuth(): Promise<Auth> {
  if (typeof window === "undefined") {
    throw new Error("getFirebaseAuth() must be called on the client")
  }
  const { getAuth, setPersistence, browserLocalPersistence } = await import("firebase/auth")
  const a = getAuth(getFirebaseApp())
  try {
    await setPersistence(a, browserLocalPersistence)
  } catch {
    // ignore persistence failures (private mode, etc.)
  }
  authInstance = a
  return a
}

// Optional compatibility bindings for modules that import these directly.
// Note: db and storage are exported as lazy proxies to avoid eager initialization at import-time.
export const app = getFirebaseApp()

export const db: Firestore = new Proxy({} as Firestore, {
  get(_t, p: keyof Firestore) {
    const real = getFirestoreDB()
    // @ts-expect-error dynamic
    return real[p]
  },
}) as Firestore

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_t, p: keyof FirebaseStorage) {
    const real = getFirebaseStorage()
    // @ts-expect-error dynamic
    return real[p]
  },
}) as FirebaseStorage

export { authInstance as auth }
