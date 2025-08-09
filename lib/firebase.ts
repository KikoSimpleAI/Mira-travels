// Robust Firebase bootstrap for Next.js App Router
// - Single app instance
// - Firestore with persistent local cache + long-polling fallback on the client
// - Client-only persistence for Auth
// - Exposes { app, auth, db } without eager multi-initialization

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
    // Ignore persistence failures (e.g. private mode)
  })
}

// Firestore singleton with resilient client initialization
let _db: Firestore | null = null

function createFirestore(): Firestore {
  if (typeof window !== "undefined") {
    try {
      // Use initializeFirestore so we can configure cache and transport
      return initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
        // Helps behind VPNs / corporate networks / preview environments
        experimentalAutoDetectLongPolling: true,
      })
    } catch {
      // If already initialized, just return default
      return getFirestore(app)
    }
  }
  // On server: return default instance (client SDK is rarely used server-side)
  return getFirestore(app)
}

export const db: Firestore = (_db ??= createFirestore())
