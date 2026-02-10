'use client'

import { usePWAinstall } from "@/hooks/usePWAinstall"

export default function PWAbtn() {

  const { isInstallable, install } = usePWAinstall();

  if (!isInstallable) return null;

  return (
    <div className="w-full mx-auto">
      <button onClick={install} className="text-sm font-semibold bg-[#1F4D4F] hover:bg-[#1F4D4F]/90 py-2 px-4 text-center tracking-tight text-white hover:text-[#C89B3C] transition-all rounded-sm shadow-sm active:scale-96">
        HOME画面にインストール
      </button>
    </div>
  )

}
