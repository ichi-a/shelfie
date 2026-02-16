"use client";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Image from "next/image";
import ai_recommend from "@/assets/image/ai_recommend.png";
import book_detail1 from "@/assets/image/book_detail1.png";
import my_shelf from "@/assets/image/my_shelf.png";
import shelf_search from "@/assets/image/shelf_search.png";

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
      <div className="mx-auto mt-80 grid w-13/14 max-w-400 grid-cols-1 justify-items-center gap-5 rounded border border-[#1F4D4F]/30 bg-[#C89B3C]/10 p-4 pt-9">
        <p className="p-1 font-serif text-xl font-bold text-[#1F4D4F]">
          アプリ紹介
        </p>
        <div className="mx-auto mb-15 h-1 w-62 bg-[#C89B3C]" />
        <p className="mt-8 border-b-2 border-[#1F4D4F]/20 pb-1 font-medium text-[#1F4D4F]/90">
          AI司書があなたの本棚を分析しベストな１冊を提案します！
        </p>
        <div className="relative mb-10 aspect-16/12 w-full max-w-300 overflow-hidden rounded border border-[#1F4D4F]/20">
          <Image
            priority
            src={ai_recommend}
            alt="アプリデモ画像"
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-26 border-b-2 border-[#1F4D4F]/20 pb-1 font-medium text-[#1F4D4F]/90">
          キーワード検索で本を本棚に追加しましょう！
        </p>
        <div className="relative mb-10 aspect-16/12 w-full max-w-300 overflow-hidden rounded border border-[#1F4D4F]/20">
          <Image
            src={shelf_search}
            alt="アプリデモ画像"
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-8 border-b-2 border-[#1F4D4F]/20 pb-1 font-medium text-[#1F4D4F]/90">
          本棚にお気に入りの本を並べましょう！
        </p>
        <div className="relative mb-10 aspect-16/12 w-full max-w-300 overflow-hidden rounded border border-[#1F4D4F]/20">
          <Image
            src={my_shelf}
            alt="アプリデモ画像"
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-8 border-b-2 border-[#1F4D4F]/20 pb-1 font-medium text-[#1F4D4F]/90">
          スコアやコメントを残してAI司書の提案の精度を上げましょう！
        </p>
        <div className="relative mb-10 aspect-16/12 w-full max-w-300 overflow-hidden rounded border border-[#1F4D4F]/20">
          <Image
            src={book_detail1}
            alt="アプリデモ画像"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
