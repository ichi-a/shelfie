"use client"; // Next.js App Routerを使用している場合は必須

import { useState } from "react";
import { getBookRecommendations } from "@/lib/geminiApi";

export const GeminiInput = () => {
  const [recommendation, setRecommendation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const books = [
    { title: "三体", author: "劉慈欣", score: "4", comment: "ええやん" },
    { title: "ジェノサイド", author: "高野和明", score: "5", comment: "緊迫感がいい" },
    { title: "R帝国", author: "中村文則", score: "2", comment: "あんまりだった" },
  ];

  const handleAiAdvice = async () => {
    setIsLoading(true);
    try {
      const result = await getBookRecommendations(books);
      setRecommendation(result);
    } catch (error) {
      console.error(error);
      setRecommendation("エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>AIおすすめ提案テスト</h3>

      {/* 現在の本棚の簡易表示 */}
      <ul style={{ fontSize: "0.8rem" }}>
        {books.map((b) => (
          <li key={b.title}>{b.title}</li>
        ))}
      </ul>

      <button
        onClick={handleAiAdvice}
        disabled={isLoading}
        className={`${isLoading && "animate-pulse"} bg-blue-500 rounded-lg p-1 cursor-pointer text-white`}
      >
        {isLoading ? "分析中..." : "次の一冊を提案してもらう"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      {/* 回答の表示エリア */}
      <div style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "15px" }}>
        {recommendation || "ボタンを押すとここに提案が表示されます"}
      </div>
    </div>
    </>
  );
};
