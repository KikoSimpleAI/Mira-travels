// Robust Firebase bootstrap for Next.js App Router (client-first usage)
// - Single app instance
// - Firestore with persistent local cache + multi-tab coordination
// - Automatic long-polling fallback for constrained networks
// - Client-only persistence for Auth
// - Exposes { app, auth, db }

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore"
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth"

// Client-safe config expected by Firebase Web SDK
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

// Auth singleton (persistence only on client)
export const auth: Auth = getAuth(app)
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Ignore persistence failures (e.g., Safari Private, embedded contexts)
  })
}

// Firestore singleton with resilient client configuration
let _db: Firestore | null = null

function createFirestore(): Firestore {
  if (typeof window !== "undefined") {
    try {
      // Use initializeFirestore to configure cache + transport behavior
      // Note: experimentalAutoDetectLongPolling is supported in modern SDKs.
      // If not, it will be ignored at runtime.
      return initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
        experimentalAutoDetectLongPolling: true,
      })
    } catch {
      // Already initialized (e.g., Fast Refresh) — return existing instance
      return getFirestore(app)
    }
  }
  // On server (rarely used for web client SDK), return default
  return getFirestore(app)
}

export const db: Firestore = (_db ??= createFirestore())
