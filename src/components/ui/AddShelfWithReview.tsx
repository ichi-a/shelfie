"use client";

import { useState } from "react";
import { analytics, auth } from "@/lib/firebase";
import { saveBookToDb, addToMyShelf } from "@/lib/booksDb";
import { toast } from "sonner";
import { Book } from "@/types/book";
import { logEvent } from "firebase/analytics";

export const AddShelfWithReview = ({ book, onClose }:{book: Book, onClose: () => void}) => {
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error("ログインしてください");

    // スコアによって status を決める
    const status = score > 0 ? "readed" : "unread";

    if (analytics) {
      logEvent(analytics, 'add_to_shelf', {
        book_title: book.title,
        book_isbn: book.isbn,
        status: status,
        score: score,
        comment: comment,
      })
    }
    try {
      await saveBookToDb(book);
      // 決まった status を第5引数に渡す
      await addToMyShelf(user.uid, book, score, comment, status);

      toast.success(status === "readed" ? "本棚に追加しました" : "Reading listに追加しました");
      setShowForm(false);
      onClose();
    } catch (e) {
      toast.error("エラーが発生しました");
      console.error(e);
    }
  };

  // ... (JSX部分は変更なし)

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-[#C89B3C] text-white py-2 text-xs font-bold tracking-widest uppercase hover:bg-[#b08834] transition-colors rounded-sm shadow-md"
      >
        本棚に追加する
      </button>
    );
  }

  return (
    <div className="border border-[#1F4D4F]/20 p-4 mt-2 text-left bg-[#F5F3EF] shadow-inner rounded-sm space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Score</label>
          <span className="text-[#C89B3C] font-bold text-xs">{score > 0 ? `${score} / 5` : "未読"}</span>
        </div>

        {/* ★ 星マーク評価（ポチポチ選択） */}
        <div className="flex gap-1.5 cursor-pointer">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setScore(num)}
              className={`text-xl transition-all hover:scale-110 ${
                num <= score ? "text-[#C89B3C]" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
          <button
            type="button"
            onClick={() => setScore(0)}
            className="text-sm text-[#1F4D4F]/40 ml-auto hover:text-[#1F4D4F] underline"
          >
            未読
          </button>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold tracking-wider opacity-60 block mb-1">My Note</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSave?.();
              (e.target as HTMLElement).blur();
            }
          }}
          className="w-full border border-[#1F4D4F]/10 text-sm p-2 h-20 resize-none bg-white focus:outline-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C] transition-all"
          maxLength={48}
          placeholder="この本の感想を一言で表すと？"
        />
        <p className="text-[9px] text-right opacity-40 mt-1">{comment.length} / 48</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#1F4D4F] text-white py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          追加
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="flex-1 border border-[#1F4D4F]/20 text-[#1F4D4F]/60 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
