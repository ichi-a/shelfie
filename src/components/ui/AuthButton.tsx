"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { loginWithGoogle, logout } from "@/lib/auth";
import { onAuthStateChanged, User } from "firebase/auth";

export const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);

  // ログイン状態を監視する
  useEffect(() => {
    // onAuthStateChangedは、ログイン・ログアウトのたびに「今のユーザー」を教えてくれる
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // 画面が消える時に監視を止める（メモリリーク防止）
    return () => unsubscribe();
  }, []);

  if (user) {
    // ログインしている時
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm">{user.displayName}さん</p>
        <button
          onClick={logout}
          className="bg-gray-200 px-4 py-2 rounded text-sm"
        >
          ログアウト
        </button>
      </div>
    );
  }

  // ログインしていない時
  return (
    <button
      onClick={loginWithGoogle}
      className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold"
    >
      Googleでログイン
    </button>
  );
};
