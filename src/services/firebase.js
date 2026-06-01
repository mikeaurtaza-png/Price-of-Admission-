// Firebase-ready service layer.
// The current V3 build runs in local/demo mode so it works immediately on Vercel.
// When you are ready for true phone-to-TV multiplayer, add these env vars in Vercel:
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
export const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;
export const db = firebaseEnabled ? getFirestore(app) : null;

export function subscribeRoom(roomCode, callback) {
  if (!db) return () => {};
  return onSnapshot(doc(db, 'rooms', roomCode), snap => callback(snap.exists() ? snap.data() : null));
}

export async function createRoom(roomCode, gameState) {
  if (!db) return;
  await setDoc(doc(db, 'rooms', roomCode), { ...gameState, updatedAt: serverTimestamp() });
}

export async function updateRoom(roomCode, patch) {
  if (!db) return;
  await updateDoc(doc(db, 'rooms', roomCode), { ...patch, updatedAt: serverTimestamp() });
}
