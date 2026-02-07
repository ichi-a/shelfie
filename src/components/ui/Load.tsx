'use client'

import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

export const Loading = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const elapsed = Date.now() - startTime;
      const minWait = 300;//0.3秒は表示

      const waitTime = Math.max(0, minWait - elapsed);

      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, waitTime);
    });

    return () => unsubscribe();
  }, []);

  // 1. ロード中は、全画面を白くして「ロード中」だけを出す
  if (loading) {
    return (
      <div className="fixed inset-0 z-9999 w-screen h-screen bg-[#F5F3EF] flex items-center justify-center">
        <p className="text-3xl text-[#1F4D4F]/70 animate-pulse">Loading...</p>
      </div>
    );
  }

  // 2. ログイン済みの場合は何も表示しない（メインコンテンツが表示される）
  if (user) {
    return null;
  }

  return null;
}
