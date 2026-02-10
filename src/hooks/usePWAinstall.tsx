'use client'

import { useEffect, useState } from "react"

interface InstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}


export const usePWAinstall = () => {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      //デフォのインストールイベント抑制
      e.preventDefault();
      //イベントを保持
      setPromptEvent(e as InstallPromptEvent)
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    //インストールイベント表示
    await promptEvent.prompt();

    setPromptEvent(null);


  }
  return { isInstallable: !!promptEvent, install };
}
