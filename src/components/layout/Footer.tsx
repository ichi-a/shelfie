'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Footer = () => {
  const pathname = usePathname();

  // // 共通のリンクスタイル
  const baseStyle = "text-sm font-bold transition-all duration-300 uppercase tracking-widest relative pb-1";
  const activeStyle = "text-[#1F4D4F]";
  const inactiveStyle = "text-[#1F4D4F]/40 hover:text-[#C89B3C]";

  // // アクティブ判定用の関数
  const isActive = (path: string) => pathname === path;

  return (
    // // フッター枠：画面下部固定
    <footer className='lerative fixed bottom-0 left-0 w-full bg-[#F5F3EF]/90 backdrop-blur-md border-t border-[#1F4D4F]/10 z-40'>
      <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>

        {/* // 左側：ロゴ（PC表示） */}
        <div className="hidden sm:block">
          <p className="text-sm font-serif font-bold tracking-[0.3em] text-[#1F4D4F]/30">
            Lib. Shelfie
          </p>
        </div>

        {/* // 右側：ナビゲーション */}
        <nav className='flex items-center gap-8 sm:gap-10 w-full sm:w-auto justify-center sm:justify-end'>
          {[
            { name: 'Home', href: '/' },
            { name: 'Search', href: '/search' },
            { name: 'Shelf', href: '/myShelf' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${baseStyle} ${isActive(link.href) ? activeStyle : inactiveStyle}`}
            >
              {link.name}

              {/* // アクティブ時だけアンダーライン */}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B3C] animate-in fade-in slide-in-from-left-1 duration-300"></span>
              )}
            </Link>
          ))}
        </nav>
        <small className='text-[#1F4D4F]/70 text-[9px] p-1 absolute right-0 bottom-0'>&copy; N - S</small>
      </div>
    </footer>
  )
}
