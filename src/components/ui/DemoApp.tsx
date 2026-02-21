import Link from "next/link";
import PWAbtn from "./InstallBtn";

export const DemoApp = () => {
  return (
    <div className="mt-70 p-20 font-semibold text-[#1F4D4F]">
      <PWAbtn />
      <p className="mt-5 font-semibold text-[#1F4D4F]">
        このアプリは現在デモ版として公開しています
      </p>
      <p>
        不具合やご意見があれば
        <Link
          href="/contact"
          className="border-b-2 border-[#C89B3C] text-[#C89B3C] hover:text-[#C89B3C]/80"
        >
          お問い合わせフォーム
        </Link>
        から教えてください
      </p>
    </div>
  );
};
