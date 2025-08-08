import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserPreferences {
  travel_style?: 'Relaxation' | 'Adventure' | 'Culture' | 'Food & Drink' | 'Nightlife';
  budget?: 'Budget-Friendly' | 'Mid-Range' | 'Luxury';
  companions?: 'Solo' | 'With a Partner' | 'With Family' | 'With Friends';
  interests?: string[];
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  username?: string;
  photoURL?: string | null;
  homeBase?: string;
  bio?: string;
  interests?: string[];
  preferences?: UserPreferences;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Fetches a user's profile from Firestore.
 * @param uid The user's unique ID.
 * @returns The user profile object or null if not found.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { uid, ...userDocSnap.data() } as UserProfile;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Creates or updates a user's profile in Firestore.
 * @param uid The user's unique ID.
 * @param data The profile data to save.
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, { 
    ...data, 
    updatedAt: serverTimestamp() 
  }, { merge: true });
}

/**
 * Checks if a username is already taken.
 * @param username The username to check.
 * @returns True if the username is available, false otherwise.
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
    if (!username) return false;
    const usernameDocRef = doc(db, 'usernames', username.toLowerCase());
    const docSnap = await getDoc(usernameDocRef);
    return !docSnap.exists();
}
