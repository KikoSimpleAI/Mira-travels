import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth"
import {
  getFirestore,
  initializeFirestore,
  enableIndexedDbPersistence,
  type Firestore,
} from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined

export function getFirebaseApp() {
  if (!app) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    if (!config.apiKey) {
      console.warn("Firebase: Missing NEXT_PUBLIC_FIREBASE_API_KEY")
    }

    app = getApps().length ? getApps()[0] : initializeApp(config)
  }
  return app
}

export function getFirebaseAuth() {
  if (!auth) {
    const app = getFirebaseApp()
    auth = getAuth(app)
    // Persist session across reloads
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // Ignore persistence errors gracefully (e.g., in private mode)
    })
  }
  return auth
}

/**
 * Returns a Firestore instance configured for reliability:
 * - Uses long-polling transport as a fallback (helps in restricted networks)
 * - Enables IndexedDB persistence (so reads can come from cache when offline)
 */
export function getFirebaseDb() {
  if (!db) {
    const app = getFirebaseApp()

    // Try initializeFirestore once (throws if already initialized)
    try {
      db = initializeFirestore(app, {
        // Long polling helps in environments where WebSockets are blocked.
        experimentalForceLongPolling: true,
        // useFetchStreams can remain default; long polling is the main lever.
      })
    } catch {
      // If it was already initialized by another call, just get the instance.
      db = getFirestore(app)
    }

    // Best-effort enable persistence (ignore multi-tab or private mode errors)
    enableIndexedDbPersistence(db).catch(() => {
      // Possible errors:
      // - failed-precondition (multiple tabs open)
      // - unimplemented (browser doesn't support IndexedDB)
      // We ignore and continue without persistence.
    })
  }
  return db
}

export function getFirebaseStorage() {
  if (!storage) {
    const app = getFirebaseApp()
    storage = getStorage(app)
  }
  return storage
}
