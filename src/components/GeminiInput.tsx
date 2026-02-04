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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getMyShelf(user.uid);
        setUserBooks(data as Book[]);
        setNowUser(true)
      } else {
        setNowUser(false)
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
      if(!aiResult) {
        toast.error("現在混みあっています。時間を置いて再度お試しください。")
        return
      }
      const parsedData = JSON.parse(aiResult);
      console.log("parsedData",parsedData)//-----------------------------------------------------
      setRecommendation(parsedData);

      if (parsedData.recommendedBooks) {
        for (const book of parsedData.recommendedBooks) {
          const searchData = await SearchBooksRgemini(book.bookTitle, book.author);
          console.log("searchData",searchData)//-------------------------------------
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
      toast.error("エラーが発生しました")
    } finally {
      setIsLoading(false);
    }
  };
  console.log("recommendation",recommendation)

  return (
    <div className="max-w-350 mt-10 mb-44 w-full mx-auto text-center rounded-sm border border-[#1F4D4F]/10 bg-white/30 px-5 py-12 shadow-inner">
      {nowUser && (
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-serif italic text-[#1F4D4F]/70">あなたの本棚を分析します</p>
            <h3 className="text-xl font-serif font-bold text-[#1F4D4F]">司書AIによる提案</h3>
          </div>
<LoadingAnime />
          <button
            onClick={handleAiAdvice}
            disabled={isLoading}
            className={`${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#C89B3C]"} bg-[#1F4D4F] text-white rounded-sm px-8 py-3 cursor-pointer transition-all font-bold tracking-[0.2em] text-sm shadow-lg`}
          >
            {isLoading ? "分析中..." : "次の一冊を相談する"}
          </button>
        </div>
      )}

      {isLoading && !recommendation && (
        <div className="w-full mx-auto text-center mt-10 space-y-4">
          <p className="animate-pulse text-[#1F4D4F]/60 font-serif italic">司書があなたの本棚を分析しています...</p>

        </div>
      )}

      {recommendation && (
        // 枠
        <div className="mt-15 mx-auto bg-[#F5F3EF] max-w-5xl max-h-11/12 w-full rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-200">

          {/* 左カラム */}
          <div className="w-full md:w-2/5 h-auto bg-white p-2 md:p-8 flex flex-col items-center border-r border-[#1F4D4F]/10">
                {bookDetails.map((item, index) => (
                <div
                  key={index} onClick={() => setSelectedBook(item)}
                  className="w-full min-h-60 mx-auto group flex flex-col ">
                  {/* 画像枠 - アスペクト比 */}
                  <div
                    className="mx-auto relative aspect-2/3 overflow-hidden cursor-pointer min-w-2/3 shadow-sm hover:shadow-xl transition-all duration-300 transform border border-black/5">
                    <img
                      src={item.largeImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* ホバー時にオーバーレイ */}
                    <div className="w-full absolute inset-0 bg-[#1F4D4F]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 text-[#1F4D4F] text-xs font-bold py-1 px-3 rounded-full shadow-lg">詳細をみる</span>
                    </div>
                  </div>
                  {/* 本のタイトル枠 */}
                  <div className="p-3 bg-white grow flex flex-col justify-between mx-auto">
                    <p className="text-[#1F4D4F] text-xs font-bold line-clamp-1 text-center leading-snug mb-1 group-hover:text-[#C89B3C] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-[#1F4D4F]/70 text-center truncate">{item.author}</p>
                  </div>
                </div>
              ))}
        </div>
        {/* 右カラム */}
        <div className="md:w-3/5 flex flex-col max-h-[85vh] overflow-y-auto p-6 w-full mx-auto max-w-3xl text-left">
            <p className="font-serif font-bold my-3 text-[#C89B3C] tracking-widest text-xs uppercase">Message from Librarian</p>
            <p className="p-3 leading-relaxed text-[#1F4D4F] font-medium border-l-4 border-[#C89B3C]">{recommendation.librarianSummary}</p>
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
