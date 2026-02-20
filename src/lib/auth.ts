import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "sonner";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // ★ 追加: サーバーにIDトークンを送ってCookieをセットする
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) throw new Error("セッション作成に失敗しました");

    console.log("ログイン成功:", result.user.displayName);
    toast.success("ログインしました");

    return result.user;
  } catch (error) {
    console.error("ログインエラー:", error);
    toast.error("ログインエラー");
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);

    // ★ 追加: サーバーのCookieを削除するAPIを叩く
    await fetch("/api/auth/session", { method: "DELETE" });

    toast("ログアウトしました");
  } catch (error) {
    console.error("ログアウトエラー:", error);
    toast.error("ログアウトエラー");
  }
};
