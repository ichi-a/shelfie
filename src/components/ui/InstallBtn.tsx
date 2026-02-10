'use client'

import { usePWAinstall } from "@/hooks/usePWAinstall"

export default function PWAbtn() {

  const { isInstallable, install } = usePWAinstall();

  if (!isInstallable) return null;

  return (
    <div className="">
      <button onClick={install}>
        インストール
      </button>
    </div>
  )

}
