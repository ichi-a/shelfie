import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics"; // ★追加

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "shelfie-ee95c.firebaseapp.com",
  projectId: "shelfie-ee95c",
  storageBucket: "shelfie-ee95c.firebasestorage.app",
  messagingSenderId: "88224647381",
  appId: "1:88224647381:web:7ceb4b86af4829a85cfa5c",
  measurementId: "G-7XF8JTWMMK"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// ──────────────────────────────────────────────
// Analytics の初期化（SSR対策）
// ──────────────────────────────────────────────
export let analytics: Analytics | undefined;

// ブラウザ環境かつ、Analyticsがサポートされている場合のみ初期化
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
