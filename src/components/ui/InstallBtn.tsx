'use client'

import { usePWAinstall } from "@/hooks/usePWAinstall"

export default function PWAbtn() {

  const { isInstallable, install } = usePWAinstall();

  if (!isInstallable) return null;

  return (
    <div className="bg-blue-600 w-full h-300">
      <button onClick={install} className="text-6xl">
        インストール
      </button>
    </div>
  )

}
