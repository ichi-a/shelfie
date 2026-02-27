"use client";

import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { SearchBooksR } from "@/lib/searchBooksRakuten";
import { toast } from "sonner";
import { BookDetailModal } from "@/components/ui/BookDetailModal";
import { Book } from "@/types/book";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function SearchPage() {
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectBook, setSelectBook] = useState<Book | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await SearchBooksR(query);
      console.log(data); //---------------------------------------
      if (!data || !data.Items) {
        throw new Error("本が見つかりません!");
      }
      setResults(data.Items);
      if (analytics) {
        logEvent(analytics, "search", {
          search_term: query,
        });
      }
    } catch (error) {
      console.error(error);
      toast("検索中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(results);

  return (
    // 背景色 #F5F3EF
    <main className="min-h-screen bg-[#F5F3EF] pt-12 pb-20 text-[#1F4D4F] transition-colors duration-500">
      <header className="mb-16 text-center">
        <h1 className="mt-5 mb-2 font-serif text-3xl font-bold">Search</h1>
        <div className="mx-auto h-1 w-12 bg-[#C89B3C]" />
      </header>
      <div className="container mx-auto space-y-8 p-4 pt-10">
        {/* 検索窓  */}
        <div className="mx-auto max-w-2xl">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="h-px w-full max-w-25 bg-[#1F4D4F]/20"></div>
          <span className="text-xs font-bold uppercase opacity-60 sm:tracking-widest">
            Search Results
          </span>
          <div className="h-px w-full max-w-25 bg-[#1F4D4F]/20"></div>
        </div>

        {/* 検索結果グリッド */}
        <div className="grid grid-cols-2 gap-6 px-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center space-y-4 py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C89B3C] border-t-transparent"></div>
              <p className="animate-pulse font-medium">本を探しています...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectBook(item)}
                className="group flex transform flex-col overflow-hidden rounded-sm border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* 画像枠 - アスペクト比 */}
                <div className="relative aspect-2/3 cursor-pointer overflow-hidden">
                  <img
                    src={item.largeImageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* ホバー時にゴールドのオーバーレイ */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1F4D4F]/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1F4D4F] shadow-lg">
                      詳細をみる
                    </span>
                  </div>
                </div>

                {/* 本のタイトル枠 */}
                <div className="flex grow flex-col justify-between bg-white p-3">
                  <p className="mb-1 line-clamp-2 text-xs leading-snug font-bold transition-colors group-hover:text-[#C89B3C]">
                    {item.title}
                  </p>
                  <p className="truncate text-[10px] text-gray-500">
                    {item.author}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full py-20 text-center font-serif text-[#1F4D4F]/40 italic">
              探している本、気になる著者名を入力してください。
            </p>
          )}
        </div>

        {/* モーダル */}
        <BookDetailModal
          mode="search"
          selectedBook={selectBook}
          onClose={() => setSelectBook(null)}
        />
      </div>
    </main>
  );
}
