"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { CarouselDemo } from "./CarouselBase";

export const Welcome = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // ログイン状態が変化したのを検知してセットする
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // クリーンアップ処理（リスナーを解除）
    return () => unsubscribe();
  }, []);

  if (user) return null;

  // auth.currentUser

  return (
    <div className="mx-auto mt-30 flex max-w-420 flex-col items-center justify-center py-4 text-center">
      {user ? (
        ""
      ) : (
        <>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[#1F4D4F]">
            Welcome to <span className="text-[#C89B3C]">Shelfie</span>
          </h2>
          <p className="max-w-xs text-sm text-[#1F4D4F]/60">
            ログインしてShelfieを楽しんでください！
          </p>
        </>
      )}
      <div className="mx-auto mt-10 grid h-13/14 w-13/14 max-w-400 grid-cols-1 justify-items-center gap-5 rounded border border-[#1F4D4F]/30 bg-[#C89B3C]/10 p-4 pt-9">
        <p className="p-1 font-serif text-xl font-bold text-[#1F4D4F]">
          アプリ紹介
        </p>
        <CarouselDemo />
      </div>
    </div>
  );
};
