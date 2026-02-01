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
      console.log(parsedData)//-----------------------------------------------------
      setRecommendation(parsedData);

      if (parsedData.recommendedBooks) {
        for (const book of parsedData.recommendedBooks) {
          const searchData = await SearchBooksRgemini(book.bookTitle, book.author);
          console.log(searchData)//-------------------------------------
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
  console.log(recommendation)

  return (
    <div className="mb-44 w-full mx-auto text-center rounded-sm border border-[#1F4D4F]/10 bg-white/30 px-5 py-12 shadow-inner">
      {nowUser && (
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-serif italic text-[#1F4D4F]/70">あなたの本棚を分析します</p>
            <h3 className="text-xl font-serif font-bold text-[#1F4D4F]">司書AIによる提案</h3>
          </div>

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
          <LoadingAnime />
        </div>
      )}

      {recommendation && (
        <div className="mt-10 bg-white border-l-4 border-[#C89B3C] p-6 w-full mx-auto rounded-sm max-w-3xl shadow-sm text-left">
          <p className="font-serif font-bold mb-3 text-[#C89B3C] tracking-widest text-xs uppercase">Message from Librarian</p>
          <p className="leading-relaxed text-[#1F4D4F] font-medium">{recommendation.librarianSummary}</p>
        </div>
      )}

      <div className="mt-12 max-w-5xl mx-auto">

              {bookDetails.map((item, index) => (
              <div
                key={index} onClick={() => setSelectedBook(item)}
                className="w-60 mx-auto group flex flex-col ">
                {/* 画像枠 - アスペクト比 */}
                <div
                  className="mx-auto relative aspect-2/3 overflow-hidden cursor-pointer w-2/3 shadow-sm hover:shadow-xl transition-all duration-300 transform border border-black/5">
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
                <div className="p-3 bg-white grow flex flex-col justify-between">
                  <p className="text-xs font-bold line-clamp-2 leading-snug mb-1 group-hover:text-[#C89B3C] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{item.author}</p>
                </div>
              </div>
            ))}
            <BookDetailModal
              mode="ai"
              selectedBook={selectedBook}
              onClose={() => setSelectedBook(null)}
            />









        {/* {bookDetails.map((book, i) => (
          <div key={book.isbn || i} className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div onClick={() => setSelectedBook(book)} className="relative mx-auto w-32 shadow-xl mb-4 transition-transform hover:-translate-y-1">
              {book?.largeImageUrl ? (
                <div>
                  <img
                    src={book.largeImageUrl}
                    alt={book.title}
                    className="w-full aspect-2/3 object-cover rounded-sm border border-[#1F4D4F]/10"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-[10px]">No Image</div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-[#1F4D4F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-[8px] text-white font-bold line-clamp-2">{book.title}</p>
              </div>
            </div>

          </div>
        ))} */}
      </div>

    </div>
  );
};
