// Production-stable Firebase setup for Next.js App Router.
// - Single app instance across client/server
// - Resilient Auth + Firestore initialization
// - Firestore: auto-detect long polling on the client to avoid WebChannel issues
// - Exports remain { app, auth, db } to preserve existing imports

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth"
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore"

// Read config from public env vars (client-safe Firebase config)
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

// Auth: initialize once. Safe on both client and server; persistence only on client.
export const auth: Auth = getAuth(app)
if (typeof window !== "undefined") {
  // Persist session across reloads; ignore failures (e.g., private mode)
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

// Firestore:
// - On the client, prefer initializeFirestore with autoDetectLongPolling to handle restricted networks.
// - On the server, default getFirestore (no browser transport).
let _db: Firestore | null = null
function createFirestore(): Firestore {
  if (typeof window !== "undefined") {
    // Auto-detect long polling helps when fetch/XHR streaming is blocked (VPNs, corporate networks, some previews)
    try {
      return initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        // Supported in current web SDK; falls back to long polling when streaming fails
        experimentalAutoDetectLongPolling: true,
      })
    } catch {
      // If already initialized, get the existing instance
      return getFirestore(app)
    }
  }
  // Node/SSR path
  return getFirestore(app)
}

export const db: Firestore = (_db ??= createFirestore())
