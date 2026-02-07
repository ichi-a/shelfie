'use client'
import { auth } from "@/lib/firebase"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"

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
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center mx-auto">
      {user ? ("") : (<>
      <h2 className="text-2xl font-bold text-[#1F4D4F] tracking-tight mb-3">
        Welcome to <span className="text-[#C89B3C]">Shelfie</span>
      </h2>
      <p className="max-w-xs text-sm text-[#1F4D4F]/60 mb-10">
        ログインしてShelfieを楽しんでください！
      </p>
      </>)}

    </div>
  )
}

