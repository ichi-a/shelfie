"use client";

import { DecodedIdToken } from "firebase-admin/auth";
import { loginWithGoogle, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const AuthButton = ({ user }: { user: DecodedIdToken | null }) => {
  const router = useRouter();

  const loginGoogle = () => {
    loginWithGoogle();
    router.refresh();
  };

  const logoutGoogle = () => {
    logout();
    router.refresh();
  };

  return (
    <>
      {user ? (
        <div className="mx-auto mb-2 flex max-w-350 items-center justify-end gap-4 rounded-full border border-[#1F4D4F]/10 bg-white/50 p-2">
          <div className="flex items-center gap-4 rounded-full border border-[#1F4D4F]/10 bg-white p-2">
            {user.photoURL && (
              <img
                src={user.picture as string}
                alt=""
                className="h-8 w-8 rounded-full border border-[#C89B3C]"
              />
            )}
            <p className="font-serif text-sm font-bold text-[#1F4D4F]">
              {user.name}
            </p>
            <button
              onClick={logoutGoogle}
              className="px-2 text-[10px] font-bold tracking-widest text-[#1F4D4F]/60 transition-colors hover:text-[#C89B3C]"
            >
              ログアウト
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={loginGoogle}
          className="m-3 flex items-center gap-2 rounded-sm bg-[#1F4D4F] px-6 py-2 text-xs font-bold tracking-widest text-[#F5F3EF] shadow-md transition-all hover:bg-[#1F4D4F]/90"
        >
          <span className="border-r border-[#F5F3EF]/30 pr-2">G</span>
          ログイン
        </button>
      )}
    </>
  );
};
