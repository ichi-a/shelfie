'use client';

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getMyShelf } from "@/lib/booksDb";
import Link from "next/link";
import { toast } from "sonner";

export default function MyShelf() {
  // 1. 取得した本を入れるための「箱（State）」を用意する
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    // 2. ログイン状態を監視して、ユーザーが確定してからデータを取る
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 3. 自作した getMyShelf 関数を使ってデータを取得
          const data = await getMyShelf(user.uid);
          setBooks(data);
        } catch (error) {
          console.error("データ取得エラー:", error);
          toast.error("エラーが発生しました")
        } finally {
          setLoading(false);
        }
      } else {
        // ログインしていない場合
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 4. 画面に表示する部分
  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (<>
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">マイ本棚</h1>

      {books.length === 0 ? (
        <p>まだ本棚に本がありません。</p>
      ) : (
        <div className="max-w-7xl mx-auto bg-amber-100 p-3 relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2 justify-center items-center mx-auto w-full">
            {books.map((book) => (
              <div key={book.isbn} className="rounded w-28 h-40 overflow-hidden mx-auto mb-2"
              onClick={() =>setSelectedBook(book)}>
                {book.score > 0 ? (
                  <p className="text-center">⭐️{book.score}</p>) : (<p>未読</p>)
                }

                <img
                  src={book.largeImageUrl}
                  alt={book.title}
                  className="w-full h-auto shadow object-cover"
                />
              </div>
            ))}
          </div>
          {/* モーダル */}
          {selectedBook && (
            <div className="fixed flex items-center justify-center inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setSelectedBook(null)}>
              <div className="shadow-2xl bg-white max-w-2/3 p-5 rounded-lg" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bold text-center mb-2">{selectedBook.title}</h3>
                <p className="text-center mb-3">{selectedBook.author}</p>
                {selectedBook.caption && (<>
                <div className="w-full overflow-y-scroll max-h-2/3 border border-gray-300 p-2">
                  <p className="leading-7">{selectedBook.caption}</p>
                </div>
                </>)}
                {selectedBook.itemUrl && (<Link target="blank" href={selectedBook.itemUrl}>詳細</Link>)}

                <button onClick={() => setSelectedBook(null)}
                className="rounded-lg text-white w-22 mx-auto bg-blue-400 hover:bg-blue-500 my-3">close</button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

  </>);
}
