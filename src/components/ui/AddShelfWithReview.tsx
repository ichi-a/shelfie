"use client";

import { useState } from "react";
import { analytics, auth } from "@/lib/firebase";
import { saveBookToDb, addToMyShelf } from "@/lib/booksDb";
import { toast } from "sonner";
import { Book } from "@/types/book";
import { logEvent } from "firebase/analytics";

export const AddShelfWithReview = ({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) => {
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const user = auth.currentUser;

  const handleSave = async () => {
    if (!user) return toast.error("ログインしてください");

    // スコアによって status を決める
    const status = score > 0 ? "readed" : "unread";

    if (analytics) {
      logEvent(analytics, "add_to_shelf", {
        book_title: book.title,
        book_isbn: book.isbn,
        status: status,
        score: score,
        comment: comment,
      });
    }
    try {
      await saveBookToDb(book);
      // 決まった status を第5引数に渡す
      await addToMyShelf(book, score, comment, status);

      toast.success(
        status === "readed"
          ? `本棚に『${book.title}』を追加しました`
          : `Reading listに『${book.title}』を追加しました`,
      );
      setShowForm(false);
      onClose();
    } catch (e) {
      toast.error("[保存失敗] エラーが発生しました");
      console.error(e);
    }
  };

  if (!showForm && !user) {
    return (
      <button
        onClick={() => toast.error("ログインしてください")}
        className="w-full rounded-sm bg-[#C89B3C] py-2 text-xs font-bold tracking-widest text-white uppercase shadow-md transition-colors hover:bg-[#b08834]"
      >
        本棚に追加する
      </button>
    );
  }

  if (!showForm && user) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full rounded-sm bg-[#C89B3C] py-2 text-xs font-bold tracking-widest text-white uppercase shadow-md transition-colors hover:bg-[#b08834]"
      >
        本棚に追加する
      </button>
    );
  }
  //未読を押すとコメント消したい
  const unreadBtn = () => {
    setScore(0);
    setComment("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-1 mt-2 space-y-4 rounded-sm border border-[#C89B3C]/30 bg-white p-4 text-left shadow-inner duration-200">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[14px] font-bold text-[#C89B3C] uppercase">
            <span className="text-sm font-medium text-[#1F4D4F]">Score: </span>
            {score > 0 ? ` ${score}` : "未読"}
          </label>
        </div>

        {/* ★ 星マーク評価（ポチポチ選択） */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setScore(num)}
              className={`text-xl transition-all hover:scale-110 active:text-[#C89B3C] ${
                num <= score ? "text-[#C89B3C]" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
          {!score && !comment ? (
            ""
          ) : (
            <button
              type="button"
              onClick={unreadBtn}
              className="ml-auto text-sm text-[#1F4D4F]/40 underline hover:text-[#1F4D4F]"
            >
              Reading listへ追加
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-bold tracking-wider opacity-60">
          My Note
        </label>
        {score > 0 && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave?.();
                (e.target as HTMLElement).blur();
              }
            }}
            className="h-20 w-full resize-none border border-[#1F4D4F]/10 bg-white p-2 text-sm transition-all focus:ring-1 focus:ring-[#C89B3C] focus:outline-[#C89B3C]"
            maxLength={48}
            placeholder="この本の感想を一言で表すと？"
          />
        )}

        <p className="mt-1 text-right text-[9px] opacity-40">
          {comment?.length} / 48
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 rounded-sm bg-[#1F4D4F] py-2 text-[10px] font-bold tracking-widest text-white uppercase transition-opacity hover:opacity-90"
        >
          追加
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="flex-1 rounded-sm border border-[#1F4D4F]/20 py-2 text-[10px] font-bold tracking-widest text-[#1F4D4F]/60 uppercase transition-colors hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
