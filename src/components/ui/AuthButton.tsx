"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { loginWithGoogle, logout } from "@/lib/auth";
import { onAuthStateChanged, User } from "firebase/auth";

export const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user) {
    return (
      <div className="max-w-350 mx-auto flex items-center gap-4 justify-end bg-white/50 p-2 rounded-full border border-[#1F4D4F]/10 mb-2">
        <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-[#1F4D4F]/10">
          {user.photoURL && (
            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-[#C89B3C]" />
          )}
          <p className="text-sm font-serif font-bold text-[#1F4D4F]">{user.displayName}</p>
          <button
            onClick={logout}
            className="text-[10px] tracking-widest font-bold text-[#1F4D4F]/60 hover:text-[#C89B3C] transition-colors px-2"
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={loginWithGoogle}
      className="m-3 flex items-center gap-2 bg-[#1F4D4F] text-[#F5F3EF] px-6 py-2 rounded-sm text-xs font-bold tracking-widest hover:bg-[#1F4D4F]/90 transition-all shadow-md"
    >
      <span className="border-r border-[#F5F3EF]/30 pr-2">G</span>
      ログイン
    </button>
  );
};
