"use client";

import { useState } from "react";
import { getBookRecommendations } from "@/lib/geminiApi";
import { SearchBooks } from "./SearchBooks ";

export const GeminiInput = () => {
  // recommendation: AIからのテキスト回答
  // bookDetails: SearchBooksで取得した本の詳細リスト
  const [recommendation, setRecommendation] = useState<any>(null);
  const [bookDetails, setBookDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const books = [
    { title: "プロジェクト・ヘイル・メアリー", author: "アンディ・ウィアー", score: "4", comment: "感動した" },
    { title: "ジェノサイド", author: "高野和明", score: "5", comment: "緊迫感がいい" },
    { title: "成瀬は天下をとりに行く", author: "宮島未奈", score: "5", comment: "おもしろかった。" },
  ];

  const handleAiAdvice = async () => {
    setIsLoading(true);
    setRecommendation(null);
    setBookDetails([]);

    try {
      // 1. Geminiから提案をもらう
      const aiResult = await getBookRecommendations(books);
      const parsedData = JSON.parse(aiResult);
      setRecommendation(parsedData);
      console.log(parsedData)

      // 2. 提案されたタイトルをもとにSearchBooksを実行
      if (parsedData.recommendedBooks) {
        const details = await Promise.all(
          parsedData.recommendedBooks.map(async (book: any) => {
            const searchData = await SearchBooks(book.bookTitle + book.author);
            console.log(searchData)
            return searchData?.items?.[0]; // 検索結果の1件目を返
          })
        );
        // nullを除外してセット
        setBookDetails(details.filter(d => d !== undefined));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }} className="mb-44">
      <p>マイ本棚をもとにおすすめを提案してもらう</p>
      <h3>AIおすすめ提案テスト</h3>

      <button
        onClick={handleAiAdvice}
        disabled={isLoading}
        className={`${isLoading && "animate-pulse"} bg-blue-500 rounded-lg p-2 cursor-pointer text-white`}
      >
        {isLoading ? "分析中..." : "次の一冊を提案してもらう"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* 1. AIのコメントを表示 */}
      {recommendation && (
        <div style={{ background: "#f9f9f9", padding: "15px", marginBottom: "20px" }}>
          <p className="font-bold mb-2">司書AIからのメッセージ：</p>
          <p>{recommendation.librarianSummary}</p>
        </div>
      )}

      {/* 2. SearchBooksで取得した画像付きの情報を表示 */}
      <div className="grid grid-cols-3 gap-1">
        {bookDetails.map((book, i) => (
          <div key={book.id || i} className="w-32 h-45 mx-auto shadow-lg">
            {/* <p className="text-sm font-bold truncate">{book.volumeInfo?.title}</p> */}
            {book.volumeInfo?.imageLinks?.thumbnail ? (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="object-cover rounded w-full h-full"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-xs">No Image</div>
            )}
            {/* <p className="text-xs text-gray-500 mt-1">{book.volumeInfo?.authors?.join(", ")}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};
