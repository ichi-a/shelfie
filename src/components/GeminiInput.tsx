"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getBookRecommendations } from "@/lib/geminiApi";
import { SearchBooksRgemini } from "@/lib/searchBooksRakuten";
import { LoadingAnime } from "./ui/LoadingAnime";
import { saveBookToDb, getMyShelf } from "@/lib/booksDb";
import { toast } from "sonner";
import { BookDetailModal } from "./ui/BookDetailModal";
import { Book, Ai } from "@/types/book";

export const GeminiInput = () => {
  const [recommendation, setRecommendation] = useState<Ai | null>(null);
  const [bookDetails, setBookDetails] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nowUser, setNowUser] = useState(false);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getMyShelf(user.uid);
        setUserBooks(data as Book[]);
        setNowUser(true);
      } else {
        setNowUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAiAdvice = async () => {
    if (userBooks.length === 0) {
      toast("まずは本棚に本を追加してください！");
      return;
    }
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
    setIsLoading(true);
    setRecommendation(null);
    setBookDetails([]);

    try {
      const aiResult = await getBookRecommendations(userBooks);
      if (!aiResult) {
        toast.error("現在混みあっています。時間を置いて再度お試しください。");
        return;
      }
      const parsedData = JSON.parse(aiResult);
      console.log("parsedData", parsedData); //-----------------------------------------------------
      setRecommendation(parsedData);

      if (parsedData.recommendedBooks) {
        for (const book of parsedData.recommendedBooks) {
          const searchData = await SearchBooksRgemini(
            book.bookTitle,
            book.author,
          );
          console.log("searchData", searchData); //-------------------------------------
          const foundBook = searchData?.Items?.[0];
          if (foundBook) {
            setBookDetails((prev) => [...prev, foundBook]);
            await saveBookToDb(foundBook);
          }
          await sleep(1000);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };
  console.log("recommendation", recommendation);

  return (
    <div className="mx-auto mt-10 mb-44 w-full max-w-350 rounded-sm border border-[#1F4D4F]/10 bg-white/30 px-5 py-12 text-center shadow-inner">
      {nowUser && (
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-serif text-[#1F4D4F]/70 italic">
              あなたの本棚を分析します
            </p>
            <h3 className="font-serif text-xl font-bold text-[#1F4D4F]">
              司書AIによる提案
            </h3>
          </div>

          <button
            onClick={handleAiAdvice}
            disabled={isLoading}
            className={`${isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-[#C89B3C]"} cursor-pointer rounded-sm bg-[#1F4D4F] px-8 py-3 text-sm font-bold tracking-[0.2em] text-white shadow-lg transition-all`}
          >
            {isLoading ? "分析中..." : "次の一冊を相談する"}
          </button>
        </div>
      )}

      {isLoading && !recommendation && (
        <div className="mx-auto mt-10 w-full space-y-4 text-center">
          <p className="animate-pulse font-serif text-[#1F4D4F]/60 italic">
            司書があなたの本棚を分析しています...
          </p>
          <LoadingAnime />
        </div>
      )}

      {recommendation && (
        // 枠
        <div className="animate-in zoom-in mx-auto mt-15 flex max-h-11/12 min-h-[30vh] w-full max-w-200 flex-col overflow-hidden rounded-sm bg-[#F5F3EF] shadow-2xl duration-200 md:flex-row">
          {/* 左カラム */}
          <div className="mx-auto flex h-auto w-full flex-col items-center border-r border-[#1F4D4F]/10 bg-white p-4 md:w-2/5 md:p-8">
            <p className="p-2 text-sm text-[#C89B3C] italic">AI司書おすすめ</p>
            {bookDetails[0] ? (
              <div>
                {bookDetails.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedBook(item)}
                    className="group flex transform flex-col overflow-hidden rounded-sm border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* 画像枠 - アスペクト比 */}
                    <div className="flex min-h-49.5 min-w-33 cursor-pointer flex-col items-center justify-center overflow-hidden">
                      <div className="relative flex-1 overflow-hidden">
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
                ))}
              </div>
            ) : (
              <div className="h-full w-full bg-[#C89B3C]/20 p-5 text-sm leading-relaxed font-medium text-[#1F4D4F]">
                <p className="mt-5 md:mt-15">
                  本が見つかりませんでした...司書は
                </p>
                <p>『{recommendation.recommendedBooks[0].bookTitle} /</p>
                <p>　{recommendation.recommendedBooks[0].author}』</p>
                <p>という本を勧めています。</p>
              </div>
            )}
          </div>
          {/* 右カラム */}
          <div className="mx-auto mt-8 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-y-auto p-6 text-left md:w-3/5">
            <p className="my-3 ml-3 font-serif text-xs font-bold tracking-widest text-[#C89B3C] uppercase">
              Message from Librarian
            </p>
            <div className="mt-5 h-full w-full">
              <p className="border-l-4 border-[#C89B3C] p-3 leading-relaxed font-medium text-[#1F4D4F]">
                {recommendation.librarianSummary}
              </p>
            </div>
          </div>
          <BookDetailModal
            mode="ai"
            selectedBook={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        </div>
      )}
    </div>
  );
};
