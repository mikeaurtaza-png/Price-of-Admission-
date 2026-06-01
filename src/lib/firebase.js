import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, onValue, get, remove, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);
export const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;
export const db = firebaseEnabled ? getDatabase(app) : null;
export { ref, set, update, onValue, get, remove, serverTimestamp };
