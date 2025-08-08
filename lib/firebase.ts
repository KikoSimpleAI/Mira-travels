// Centralized Firebase initialization with lazy client-only Auth getter
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

// IMPORTANT: Do not import from 'firebase/auth' at the module top-level to avoid
// SSR registration issues. We'll dynamically import it inside getFirebaseAuth().

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
      console.warn("Firebase config missing required keys. Check NEXT_PUBLIC_FIREBASE_* env vars.")
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

// Lazy, client-only Auth getter to avoid SSR "Component auth has not been registered yet" errors.
export async function getFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("getFirebaseAuth() must be called on the client")
  }
  // Dynamically import to ensure the auth component registers against the same app instance on the client.
  const { getAuth, setPersistence, browserLocalPersistence, type Auth } = await import("firebase/auth")
  const auth = getAuth(getFirebaseApp())
  // Persist session across reloads, ignore failures silently (e.g., in private mode)
  try {
    await setPersistence(auth, browserLocalPersistence)
  } catch {
    // no-op
  }
  return auth as Auth
}

// Named export 'app' for modules expecting it.
// Note: This returns the singleton app instance (initializes on first call).
export const app = getFirebaseApp()
