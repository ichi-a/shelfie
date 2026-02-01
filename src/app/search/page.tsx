'use client';

import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar'
import { SearchBooksR } from '@/lib/searchBooksRakuten';
import { toast } from 'sonner';
import { BookDetailModal } from '@/components/ui/BookDetailModal';
import { Book } from '@/types/book';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function SearchPage() {
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectBook, setSelectBook] = useState<Book | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await SearchBooksR(query)
      console.log(data)//---------------------------------------
      if (!data || !data.Items) {
        throw new Error('本が見つかりません!');
      }
      setResults(data.Items);
      if (analytics) {
        logEvent(analytics, 'search', {
          search_term: query,
        })
      }
    } catch (error) {
      console.error(error);
      toast('検索中にエラーが発生しました')
    } finally {
      setIsLoading(false);
    }
  };
  console.log(results)

  return (
    // 背景色 #F5F3EF
    <main className="min-h-screen bg-[#F5F3EF] text-[#1F4D4F] transition-colors duration-500 pt-12 pb-20">
        <header className="text-center mb-16">
          <h1 className="mt-5 text-3xl font-serif font-bold mb-2">Search</h1>
          <div className="h-1 w-12 bg-[#C89B3C] mx-auto" />
        </header>
      <div className="container mx-auto p-4 pt-10 space-y-8">



        {/* 検索窓  */}
        <div className="max-w-2xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="h-px w-full max-w-25 bg-[#1F4D4F]/20"></div>
          <span className="text-xs font-bold sm:tracking-widest uppercase opacity-60">Search Results</span>
          <div className="h-px w-full max-w-25 bg-[#1F4D4F]/20"></div>
        </div>

        {/* 検索結果グリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 px-2">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center py-20 space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-[#C89B3C] border-t-transparent rounded-full"></div>
              <p className="font-medium animate-pulse">本を探しています...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <div
                key={index} onClick={() => setSelectBook(item)}
                className="group flex flex-col bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-black/5">
                {/* 画像枠 - アスペクト比 */}
                <div
                  className="relative aspect-2/3 overflow-hidden cursor-pointer">
                  <img
                    src={item.largeImageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* ホバー時にゴールドのオーバーレイ */}
                  <div className="absolute inset-0 bg-[#1F4D4F]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-[#1F4D4F] text-xs font-bold py-1 px-3 rounded-full shadow-lg">詳細をみる</span>
                  </div>
                </div>

                {/* 本のタイトル枠 */}
                <div className="p-3 bg-white grow flex flex-col justify-between">
                  <p className="text-xs font-bold line-clamp-2 leading-snug mb-1 group-hover:text-[#C89B3C] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{item.author}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center py-20 font-serif italic text-[#1F4D4F]/40">
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
