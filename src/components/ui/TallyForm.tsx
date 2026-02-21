"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function ContactPage() {
  useEffect(() => {
    // ページに遷移してくるたびに Tally の埋め込みを再スキャンする
    // @ts-expect-error: Tally is loaded from an external script
    if (typeof window.Tally !== 'undefined') {
      // @ts-expect-error: Tally is loaded from an external script
      window.Tally.loadEmbeds();
    }
  }, []);

  const app = "shelfie"
  return (
    <div className="min-h-screen p-8 max-w-141 mx-auto">
      <h2 className="text-[#1F4D4F] text-lg font-bold mb-4 tracking-tight text-center">
        Contact <span className="text-[#C89B3C]">Shelfie</span>
      </h2>

      <div className="max-w-3xl mx-auto border border-[#1F4D4F]/10 rounded-xl overflow-hidden shadow-sm">
        <iframe
          data-tally-src={`https://tally.so/embed/EkQzWq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&app_name=${app}`}
          loading="lazy"
          width="100%"
          height="500" // 高さをしっかり指定しておくとガタつきません
          title="Shelfie Contact"
          className="w-full border-none"
        ></iframe>
      </div>

      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          // 初回読み込み時用
          // @ts-expect-error: Tally is loaded from an external script
          window.Tally?.loadEmbeds();
        }}
      />
    </div>
  );
}
