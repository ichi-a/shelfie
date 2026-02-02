"use client"; // ブラウザで動くので必須

import { auth } from "@/lib/firebase";
import { saveBookToDb, addToMyShelf } from "@/lib/booksDb";
import { toast } from "sonner";
import { Book } from "@/types/book";

// AddShelfButton (AI提案用 - シンプル)
export const AddShelfButton = ({ book, onClose }:{book: Book, onClose: () => void}) => {
  const handleAddShelf = async () => {
    const user = auth.currentUser;
    if (!user) return toast.info("ログインしてください");
    try {
      await saveBookToDb(book);
      // 第5引数に "unread" を渡す
      await addToMyShelf(user.uid, book, 0, "", "unread");
      onClose();
      toast.success(`『${book.title}』をReading listに追加しました`);
    } catch (error) {
      toast.error("保存失敗");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleAddShelf}
      className="w-full bg-[#C89B3C] text-white py-2 text-xs font-bold tracking-widest uppercase hover:bg-[#b08834] transition-colors rounded-sm shadow-md"
    >
      本棚に追加する
    </button>
  );
};
