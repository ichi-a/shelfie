'use client'
import { auth } from "@/lib/firebase"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"
import Image from "next/image"
import ai_recommend from "@/assets/image/ai_recommend.png"
import book_detail from "@/assets/image/book_detail.png"
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
    <div className="max-w-180 flex flex-col items-center justify-center min-h-[50vh] px-4 text-center mx-auto">
      {user ? ("") : (<>
      <h2 className="text-2xl font-bold text-[#1F4D4F] tracking-tight mb-3">
        Welcome to <span className="text-[#C89B3C]">Shelfie</span>
      </h2>
      <p className="max-w-xs text-sm text-[#1F4D4F]/60 mb-10">
        ログインしてShelfieを楽しんでください！
      </p>
      </>)}
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 justify-items-center">
          <div className="w-full max-w-100 aspect-16/12 relative border border-black overflow-hidden">
            <Image src={ai_recommend} alt="アプリデモ画像" className="object-cover"/>
          </div>
          <div className="w-full max-w-100 aspect-16/12 relative border border-black overflow-hidden">
            <Image src={shelf_search} alt="アプリデモ画像" className="object-cover"/>
          </div>
          <div className="w-full max-w-100 aspect-16/12 relative border border-black overflow-hidden">
            <Image src={my_shelf} alt="アプリデモ画像" fill className="object-cover"/>
          </div>
          <div className="w-full max-w-100 aspect-16/12 relative border border-black overflow-hidden">
            <Image src={book_detail} alt="アプリデモ画像" fill className="object-cover"/>
          </div>
        </div>
    </div>
  )
}

