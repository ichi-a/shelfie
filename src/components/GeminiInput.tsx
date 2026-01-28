"use client";

import { useState } from "react";
import { getBookRecommendations } from "@/lib/geminiApi";
// import { SearchBooks } from "./SearchBooks ";
import { SearchBooksRgemini } from "@/lib/searchBooksRakuten";
import { LoadingAnime } from "./ui/LoadingAnime";
import { saveBookToDb } from "@/lib/booksDb";

export const GeminiInput = () => {
  // recommendation: AIからのテキスト回答
  // bookDetails: SearchBooksで取得した本の詳細リスト
  const [recommendation, setRecommendation] = useState<any>(null);
  const [bookDetails, setBookDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const books = [
    { title: "人魚が逃げた", author: "青山美智子", score: "4", comment: "なぜか引き込まれた" },
    { title: "同士少女よ、敵を撃て", author: "逢坂冬馬", score: "1", comment: "おもんない" },
    { title: "R帝国", author: "中村文則", score: "2", comment: "哲学色が少し強かった" },
    { title: "のぼうの城", author: "和田竜", score: "3", comment: "そこそこ" },
    { title: "三体", author: "劉慈欣", score: "4", comment: "傑作" },
  ];
  const handleAiAdvice = async () => {
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
    setIsLoading(true);
    setRecommendation(null);
    setBookDetails([]); // 本のリストを空にする

    try {
      // 1. まずGeminiから提案をもらう
      const aiResult = await getBookRecommendations(books);
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
  // const handleAiAdvice = async () => {
  //   setIsLoading(true);
  //   setRecommendation(null);
  //   setBookDetails([]);

  //   try {
  //     // 1. Geminiから提案をもらう
  //     const aiResult = await getBookRecommendations(books);
  //     const parsedData = JSON.parse(aiResult);
  //     setRecommendation(parsedData);
  //     console.log(parsedData)

  //     // 2. 提案されたタイトルをもとにSearchBooksを実行
  //     if (parsedData.recommendedBooks) {
  //       const details = await Promise.all(
  //         parsedData.recommendedBooks.map(async (book: any) => {
  //           const searchData = await SearchBooks(book.bookTitle + book.author);
  //           console.log(searchData)
  //           return searchData?.items?.[0]; // 検索結果の1件目を返
  //         })
  //       );
  //       // nullを除外してセット
  //       setBookDetails(details.filter(d => d !== undefined));
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="mb-44 w-full mx-auto text-center rounded-xl border border-gray-500 p-5">
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
            {/* <p className="text-sm font-bold truncate">{book.volumeInfo?.title}</p> */}
            {book?.mediumImageUrl ? (
              <img
                src={book.largeImageUrl}
                alt={book.title}
                className="object-cover rounded w-full h-full shadow-lg border border-gray-200 "
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-xs">本が見つかりません</div>
            )}
            {/* <p className="text-xs text-gray-500 mt-1">{book.volumeInfo?.authors?.join(", ")}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};
