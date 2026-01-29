"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { saveBookToDb, addToMyShelf } from "@/lib/booksDb";

export const AddShelfWithReview = ({ book }: { book: any }) => {
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false); // 入力フォームの表示管理

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("ログインしてね");

    try {
      await saveBookToDb(book);
      // スコアとコメントを渡して保存！
      await addToMyShelf(user.uid, book, score, comment);
      alert("評価付きで保存したよ！");
      setShowForm(false);
    } catch (e) {
      alert("エラー");
    }
  };

  if (!showForm) {
    return <button onClick={() => setShowForm(true)} className="bg-green-500 text-white px-2 py-1 rounded">本棚に追加</button>;
  }

  return (
    <div className="border p-2 mt-2 text-left bg-white shadow-md rounded">
      <div className="mb-2">
        <label className="text-xs block">評価: {score}点</label>
        <input
          type="range" min="1" max="5" value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-2">
        <label className="text-xs block">ひとこと</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border text-sm p-1 resize-none"
          maxLength={30}
          placeholder="ひとことコメント(30文字以内)"
        />
      </div>
      <button onClick={handleSave} className="w-full bg-blue-500 text-white py-1 rounded text-sm">保存確定</button>
      <button onClick={() => setShowForm(false)} className="w-full text-xs text-gray-400 mt-1">キャンセル</button>
    </div>
  );
};
