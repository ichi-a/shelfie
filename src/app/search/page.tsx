'use client';
//検索ページ

import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar'
// import BookCard from '@/components/features/BookCard'; // 後で作る
import { SearchBooksR } from '@/lib/searchBooksRakuten';
import Link from 'next/link';
import { AddShelfWithReview } from '@/components/ui/AddShelfWithReview';

export default function SearchPage() {
  const [results, setResults] = useState([]); // 検索結果を格納
  const [isLoading, setIsLoading] = useState(false); // ローディング状態

  const handleSearch = async (query: string) => {

    setIsLoading(true);
    try {
      console.log("query:", query)
      const data = await SearchBooksR(query)
      console.log("URL通ったあと:",data)

      if (!data || !data.Items) {
        throw new Error('本が見つかりません!');
      }

      // 楽天APIのレスポンス構造に合わせてデータをセット
      // data.Items は [{ Item: {...} }, { Item: {...} }] という形を想定
      setResults(data.Items);

    } catch (error) {
      console.error(error);
      alert('検索中にエラーが発生しました' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 space-y-8 mt-5">
      <div className='flex gap-2 justify-center'>
        <Link href="/" className="text-blue-500 underline hover:text-blue-700">HOME</Link>
        <Link href="/myShelf" className="text-blue-500 underline hover:text-blue-700">My本棚</Link>
      </div>
      <h1 className="text-2xl font-bold text-center">本を検索する</h1>

      {/* 検索窓コンポーネント */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <hr className="border-gray-200" />

      {/* 検索結果の表示エリア */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-4 justify-center mx-auto">
        {isLoading ? (
          <p className="col-span-full text-center py-10">読み込み中...</p>
        ) : results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className="p-4 rounded shadow-sm text-center max-w-80 mx-auto">
               {/* 仮の表示。後で BookCard コンポーネントに置き換える */}
              <div className='overflow-hidden w-28 h-16'>
                <p className="text-sm font-bold line-clamp-2 m-2 w-full mx-auto">{item.title}</p>
              </div>
              <div className='w-28 h-40 mb-2 overflow-hidden mx-auto'>
                <img src={item.largeImageUrl} alt={item.title} className="w-full h-auto object-cover" />
              </div>
              {/* <p className="text-xs text-gray-500">{item.author}</p> */}
              <AddShelfWithReview book={item} />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center py-10 text-gray-400">
            キーワードを入力して本を探してみましょう
          </p>
        )}
      </div>
    </main>
  );
}

