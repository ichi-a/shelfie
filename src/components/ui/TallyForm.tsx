"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function ContactPage() {
  useEffect(() => {
    // ページに遷移してくるたびに Tally の埋め込みを再スキャンする
    // @ts-expect-error: Tally is loaded from an external script
    if (typeof window.Tally !== "undefined") {
      // @ts-expect-error: Tally is loaded from an external script
      window.Tally.loadEmbeds();
    }
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-141 p-8">
      <h2 className="mb-4 text-center text-lg font-bold tracking-tight text-[#1F4D4F]">
        Contact <span className="text-[#C89B3C]">Shelfie</span>
      </h2>

      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-[#1F4D4F]/10 shadow-sm">
        <iframe
          data-tally-src="https://tally.so/embed/EkQzWq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
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
