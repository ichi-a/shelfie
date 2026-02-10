'use client'
import { auth } from "@/lib/firebase"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"
import Image from "next/image"
import ai_recommend from "@/assets/image/ai_recommend.png"
import book_detail1 from "@/assets/image/book_detail1.png"
import my_shelf from "@/assets/image/my_shelf.png"
import shelf_search from "@/assets/image/shelf_search.png"

export const Welcome = () => {

  const [user, setUser] = useState< User | null>(null)

  useEffect(() => {
  // ログイン状態が変化したのを検知してセットする
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    setUser(currentUser);
  });


  // クリーンアップ処理（リスナーを解除）
  return () => unsubscribe();
}, []);


if (user) return null

// auth.currentUser



  return (
    <div className="max-w-420 mt-30 flex flex-col items-center justify-center px-4 text-center mx-auto">
      {user ? ("") : (<>
      <h2 className="text-2xl font-bold text-[#1F4D4F] tracking-tight mb-3">
        Welcome to <span className="text-[#C89B3C]">Shelfie</span>
      </h2>
      <p className="max-w-xs text-sm text-[#1F4D4F]/60 mb-40">
        ログインしてShelfieを楽しんでください！
      </p>
      </>)}
        <div className="mx-auto w-10/12 max-w-400 grid grid-cols-1 p-5 gap-5 justify-items-center">
          <p className="text-xl font-serif font-bold p-1 text-[#1F4D4F]">アプリ紹介</p>
          <div className="h-1 w-62 bg-[#C89B3C] mx-auto mb-15" />
          <p className="text-[#1F4D4F]/80 font-medium mt-8">AI司書があなたの本棚を分析しベストな１冊を提案します！</p>
          <div className="mb-10 w-full max-w-300 aspect-16/12 relative rounded border border-[#1F4D4F]/20 overflow-hidden">
            <Image src={ai_recommend} alt="アプリデモ画像" fill className="object-cover"/>
          </div>
          <p className="text-[#1F4D4F]/80 font-medium mt-8">キーワード検索で本を本棚に追加しましょう！</p>
          <div className="mb-10 w-full max-w-300 aspect-16/12 relative rounded border border-[#1F4D4F]/20 overflow-hidden">
            <Image src={shelf_search} alt="アプリデモ画像" fill className="object-cover"/>
          </div>
          <p className="text-[#1F4D4F]/80 font-medium mt-8">本棚にお気に入りの本を並べましょう！</p>
          <div className="mb-10 w-full max-w-300 aspect-16/12 relative rounded border border-[#1F4D4F]/20 overflow-hidden">
            <Image src={my_shelf} alt="アプリデモ画像" fill className="object-cover"/>
          </div>
          <p className="text-[#1F4D4F]/80 font-medium mt-8">スコアやコメントを残してAI司書の提案の精度を上げましょう！</p>
          <div className="mb-10 w-full max-w-300 aspect-16/12 relative rounded border border-[#1F4D4F]/20 overflow-hidden">
            <Image src={book_detail1} alt="アプリデモ画像" fill className="object-cover"/>
          </div>
        </div>
    </div>
  )
}

