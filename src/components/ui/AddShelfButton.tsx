"use client"; // ブラウザで動くので必須

import { auth } from "@/lib/firebase";
import { saveBookToDb, addToMyShelf } from "@/lib/booksDb";

// 【解説】Propsとして「book」を受け取れるようにします
interface Props {
  book: any;
}

export const AddShelfButton = ({ book }: Props) => {

  // 【解説】実際の保存処理（クリックされた時に動く関数）
  const handleAddShelf = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("ログインしてね！");
      return;
    }

    try {
      await saveBookToDb(book);
      await addToMyShelf(user.uid, book);
      alert(`『${book.title}』を追加したよ！`);
    } catch (error) {
      alert("保存に失敗しました" + error);
    }
  };

  // 【解説】見た目だけを return する
  return (
    <button
      onClick={handleAddShelf}
      className="mt-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
    >
      本棚に追加
    </button>
  );
};
