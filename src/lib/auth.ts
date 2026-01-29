import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { auth } from "./firebase"; // 以前作成したfirebase.ts

// Googleログイン用のプロバイダー（設定）を作成
const provider = new GoogleAuthProvider();

/**
 * Googleログインを実行する関数
 */
export const loginWithGoogle = async () => {
  try {
    // ポップアップ画面でログインを実行
    const result = await signInWithPopup(auth, provider);
    console.log("ログイン成功:", result.user.displayName);
    return result.user;
  } catch (error) {
    console.error("ログインエラー:", error);
    throw error;
  }
};

/**
 * ログアウトを実行する関数
 */
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("ログアウトしました");
  } catch (error) {
    console.error("ログアウトエラー:", error);
  }
};
