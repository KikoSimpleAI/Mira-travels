// Robust Firebase bootstrap for Next.js App Router
// - Single app instance
// - Firestore with persistent local cache and long-polling fallback on the client
// - Client-only persistence for Auth
// - Exposes { app, auth, db } and avoids eager multi-initialization

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
  // Persistent cache (available in Firestore Web v10+)
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore"
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth"

// Client-safe config (Firebase SDK expects public keys on the client)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Singleton app
export const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

// Auth singleton
export const auth: Auth = getAuth(app)
if (typeof window !== "undefined") {
  // Persist session across reloads; ignore environments that block persistence (e.g., private mode)
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

// Firestore singleton with resilient client initialization
let _db: Firestore | null = null

function createFirestore(): Firestore {
  // On the client, prefer initializeFirestore to configure cache and transport.
  if (typeof window !== "undefined") {
    try {
      return initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        // Persist data across reloads and multi-tabs; falls back automatically when IndexedDB is unavailable
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
        // Helps in restricted networks (VPN, corporate, some previews)
        experimentalAutoDetectLongPolling: true,
      })
    } catch {
      // If already initialized, just return the default
      return getFirestore(app)
    }
  }
  // On server/SSR (rarely used for client SDK operations), return default
  return getFirestore(app)
}

export const db: Firestore = (_db ??= createFirestore())
