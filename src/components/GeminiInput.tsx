"use client";

import { useState, useEffect } from "react"; // useEffectを追加
import { auth } from "@/lib/firebase"; // authをインポート
import { onAuthStateChanged } from "firebase/auth"; // 監視用
import { getBookRecommendations } from "@/lib/geminiApi";
// import { SearchBooks } from "./SearchBooks ";
import { SearchBooksRgemini } from "@/lib/searchBooksRakuten";
import { LoadingAnime } from "./ui/LoadingAnime";
import { saveBookToDb, getMyShelf } from "@/lib/booksDb";
import { AddShelfButton } from "./ui/AddShelfButton";

export const GeminiInput = () => {
  // recommendation: AIからのテキスト回答
  // bookDetails: SearchBooksで取得した本の詳細リスト
  const [recommendation, setRecommendation] = useState<any>(null);
  const [bookDetails, setBookDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 【解説】実データを保持するState
  const [userBooks, setUserBooks] = useState<any[]>([]);

  // 【解説】画面読み込み時（またはログイン時）に本棚データを取得
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getMyShelf(user.uid);
        setUserBooks(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAiAdvice = async () => {
    if (userBooks.length === 0) {
      alert("まずは本棚に本を追加してみてね！");
      return;
    }
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
    setIsLoading(true);
    setRecommendation(null);
    setBookDetails([]); // 本のリストを空にする

    try {
      // 1. まずGeminiから提案をもらう
      const aiResult = await getBookRecommendations(userBooks);
      if(!aiResult) {
        alert("現在混みあっています。時間を置いて再度お試しください。")
        return
      }
      const parsedData = JSON.parse(aiResult);
      console.log(parsedData)

      // ここで司書のメッセージを先にセット！画面にコメントが表示される
      setRecommendation(parsedData);

      // 2. 提案された本を「1冊ずつ」検索して追加していく
      if (parsedData.recommendedBooks) {
        // const tempDetails: any[] = [];

        for (const book of parsedData.recommendedBooks) {
          // 楽天APIを叩く
          const searchData = await SearchBooksRgemini(book.bookTitle, book.author);
          console.log("gemini用API:",searchData)

          // 楽天APIのレスポンス形式に合わせて取得（Items[0]など、APIの戻り値を確認してください）
          const foundBook = searchData?.Items?.[0];

          if (foundBook) {

            // 前のリストに新しい1冊を加えてStateを更新（これで1冊ずつ増えて見える）
            setBookDetails((prev) => [...prev, foundBook]);
            await saveBookToDb(foundBook);
          }

          // 楽天API制限のため、次のループへ行く前に1秒待機
          await sleep(1000);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-44 w-full mx-auto text-center rounded-xl border border-gray-500 px-5 py-10">
      <p>マイ本棚をもとにおすすめを提案してもらう</p>
      <h3>AIおすすめ提案テスト</h3>

      <button
        onClick={handleAiAdvice}
        disabled={isLoading}
        className={`${isLoading && "animate-pulse"} bg-blue-500 rounded-lg p-2 cursor-pointer text-white`}
      >
        {isLoading ? "分析中..." : "次の一冊を提案してもらう"}
      </button>

      <div className="border-b border-b-gray-300 my-3" />
      {isLoading && !recommendation && (
        <div className="w-full mx-auto text-center">
          <p className={`${isLoading && "animate-pulse"} text-gray-500 mx-auto`}>司書があなたの本棚を分析しています...</p>
          <LoadingAnime />
        </div>
      )}

      {/* 1. AIのコメントを表示 */}
      {recommendation && (
        <div className="bg-gray-100 p-2 w-full mx-auto rounded max-w-3xl">
          <p className="font-bold mb-2">司書AIからのメッセージ</p>
          <p className="p-4 leading-7 ">{recommendation.librarianSummary}</p>
        </div>
      )}

      {/* 2. SearchBooksで取得した画像付きの情報を表示 */}
      <div className="flex justify-center items-center gap-1 w-2/3 mx-auto">
        {bookDetails.map((book, i) => (
          <div key={book.isbn || i} className={`transition-all duration-300 w-32 h-45 mx-auto shadow-lg my-4 ${book ? "opacity-100" : "opacity-0"}`}>
            <p className="text-sm font-bold truncate">{book.title}</p>
            {book?.largeImageUrl ? (
              <img
                src={book.largeImageUrl}
                alt={book.title}
                className="object-cover rounded w-full h-full shadow-lg border border-gray-200 "
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-xs">本が見つかりません</div>
            )}
            {/* <p className="text-xs text-gray-500 mt-1">{book.volumeInfo?.authors?.join(", ")}</p> */}
            <AddShelfButton book={book}/>
          </div>
        ))}
      </div>
    </div>
  );
};
