import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from "firebase/auth"

let app: FirebaseApp | undefined
let auth: Auth | undefined

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
