"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();

  // // 共通のリンクスタイル
  const baseStyle =
    "text-sm font-bold transition-all duration-300 uppercase tracking-widest relative pb-1";
  const activeStyle = "text-[#1F4D4F]";
  const inactiveStyle = "text-[#1F4D4F]/40 hover:text-[#C89B3C]";

  // // アクティブ判定用の関数
  const isActive = (path: string) => pathname === path;

  return (
    // // フッター枠：画面下部固定
    <footer className="lerative fixed bottom-0 left-0 z-40 w-full border-t border-[#1F4D4F]/10 bg-[#F5F3EF]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* // 左側：ロゴ（PC表示） */}
        <div className="hidden sm:block">
          <p className="font-serif text-sm font-bold tracking-[0.3em] text-[#1F4D4F]/30">
            Lib. Shelfie
          </p>
        </div>

        {/* // 右側：ナビゲーション */}
        <nav className="flex w-full items-center justify-center gap-8 sm:w-auto sm:justify-end sm:gap-10">
          {[
            { name: "Home", href: "/" },
            { name: "Search", href: "/search" },
            { name: "Shelf", href: "/myShelf" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${baseStyle} ${isActive(link.href) ? activeStyle : inactiveStyle}`}
            >
              {link.name}

              {/* // アクティブ時だけアンダーライン */}
              {isActive(link.href) && (
                <span className="animate-in fade-in slide-in-from-left-1 absolute bottom-0 left-0 h-0.5 w-full bg-[#C89B3C] duration-300"></span>
              )}
            </Link>
          ))}
        </nav>
        <small className="absolute right-0 bottom-0 p-1 text-[9px] text-[#1F4D4F]/70">
          &copy;2026 N-S
        </small>
      </div>
    </footer>
  );
};
