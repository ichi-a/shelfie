'use client';
//検索ページ

import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar'
// import BookCard from '@/components/features/BookCard'; // 後で作る
import { SearchBooksR } from '@/lib/searchBooksRakuten';
import Link from 'next/link';
import { AddShelfWithReview } from '@/components/ui/AddShelfWithReview';
import { toast } from 'sonner';

export default function SearchPage() {
  const [results, setResults] = useState([]); // 検索結果を格納
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const [selectBook, setSelectBook] = useState(null);

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
      toast('検索中にエラーが発生しました')

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 space-y-8 mt-5">
      <h1 className="text-2xl font-bold text-center">本を検索する</h1>

      {/* 検索窓コンポーネント */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <hr className="border-gray-200" />

      {/* 検索結果の表示エリア */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-4 justify-center mx-auto">
        {isLoading ? (
          <p className="col-span-full text-center py-10">読み込み中...</p>
          ) : results.length > 0 ? (
            // 本１冊の並び
            results.map((item, index) => (
              <div key={index} className="p-4 rounded shadow-sm text-center max-w-80 mx-auto">
                {/* 仮の表示。後で BookCard コンポーネントに置き換える */}
                {/* 一覧状態の本１冊の枠 */}
                <div className='overflow-hidden w-28 h-16'>
                  <p className="text-sm font-bold line-clamp-2 m-2 w-full mx-auto">{item.title}</p>
                </div>
                {/* 一覧状態の本１冊の画像枠 */}
                <div className='w-28 h-40 mb-2 overflow-hidden mx-auto' onClick={() => setSelectBook(item)}>
                  <img src={item.largeImageUrl} alt={item.title} className="w-full h-auto object-cover" />
                </div>
                  {selectBook && (
                  //  Overlay
              <div className="fixed flex items-center justify-center inset-0 bg-black/5 backdrop-blur-xs" onClick={() => setSelectBook(null)}>
                {/* モーダル枠 */}
                <div className="shadow-2xl bg-white max-w-2/3 p-5 rounded-lg" onClick={(e) => e.stopPropagation()}>
                  <div className='flex justify-center items-center gap-3'>
                    {/* モーダル内画像 */}
                    <div>
                      <img src={selectBook.largeImageUrl} alt="" />
                    </div>
                    {/* モーダル内タイトル、著者 */}
                    <div>
                      <h3 className="font-bold text-center mb-2">{selectBook.title}</h3>
                      <p className="text-center mb-3">{selectBook.author}</p>
                    </div>
                  </div>
                  <div>
                    {/* モーダル内あらすじ */}
                    {selectBook.itemCaption && (<>
                    <div className="w-full overflow-y-scroll max-h-2/3 border border-gray-300 p-2">
                      <p className="leading-7">{selectBook.itemCaption}</p>
                    </div>
                    </>)}
                    {selectBook.itemUrl && (<Link target="blank" href={selectBook.itemUrl}>詳細</Link>)}
                    <button onClick={() => setSelectBook(null)}
                    className="rounded-lg text-white w-22 mx-auto bg-blue-400 hover:bg-blue-500 my-3">close</button>
                    <div className='max-w-1/2 mx-auto'>
                      <AddShelfWithReview book={item} />
                    </div>
                  </div>
                </div>

            </div>
          )}
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

