"use client";

import { usePWAinstall } from "@/hooks/usePWAinstall";

export default function PWAbtn() {
  const { isInstallable, install } = usePWAinstall();

  if (!isInstallable) return null;

  return (
    <div className="mx-auto w-full">
      <button
        onClick={install}
        className="rounded-sm bg-[#1F4D4F] px-4 py-2 text-center text-sm font-semibold tracking-tight text-white shadow-sm transition-all hover:bg-[#1F4D4F]/90 hover:text-[#C89B3C] active:scale-96"
      >
        HOME画面にインストール
      </button>
    </div>
  );
}
