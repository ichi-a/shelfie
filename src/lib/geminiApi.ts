import { Book } from "@/types/book";

export async function getBookRecommendations(books: Book[]) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ books }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    // 既存の GeminiInput.tsx が JSON.parse() することを想定し、
    // 元の挙動に合わせて文字列で返します。
    return JSON.stringify(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}
