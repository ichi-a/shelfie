import Link from "next/link"
import PWAbtn from "./InstallBtn"


export const DemoApp = () => {
  return (
    <div className="text-[#1F4D4F] font-semibold mt-60 p-20">
      <p>このアプリは現在デモ版として公開しています</p>
      <p>不具合やご意見があれば<Link href="/contact" className="text-[#C89B3C] border-b-2 border-[#C89B3C] hover:text-[#C89B3C]/80">お問い合わせフォーム</Link>から教えてください</p>
    <PWAbtn />
    </div>
  )
}
