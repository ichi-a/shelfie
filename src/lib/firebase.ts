// Import the functions you need from the SDKs you need
import "firebase/auth"; // ← Firebase Authenticationを使用するために必要
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "shelfie-1b0b1.firebaseapp.com",
  projectId: "shelfie-1b0b1",
  storageBucket: "shelfie-1b0b1.firebasestorage.app",
  messagingSenderId: "805668019060",
  appId: "1:805668019060:web:77f02164bb403d917faa21",
  measurementId: "G-KJTJ6W1C17"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);



// ──────────────────────────────────────────────
// アプリを「一度だけ」初期化
// 複数回初期化を防ぐためのチェック
// ──────────────────────────────────────────────
// getApps(): 既に初期化されたFirebaseアプリの配列を取得
// 配列が空（length === 0）の場合は初期化、そうでなければ既存のアプリを取得
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// export const analytics =
//   typeof window !== "undefined" ? getAnalytics(app) : null;
// ──────────────────────────────────────────────
// 各 Firebase サービスのインスタンスを作成 + exportして使いやすくしてる
// ──────────────────────────────────────────────
export const auth = getAuth(app); // Firebase Authentication - ユーザー認証
export const db = getFirestore(app); // Cloud Firestore - NoSQLデータベース
// export const storage = getStorage(app) // Cloud Storage - ファイルストレージ

// デフォルトエクスポート（必要に応じて使用）
export default app;
