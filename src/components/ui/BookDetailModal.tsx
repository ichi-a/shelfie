'use client';

import Link from "next/link";
import { AddShelfWithReview } from "./AddShelfWithReview";
import { AddShelfButton } from "./AddShelfButton";
import { Book, ModalMode } from "@/types/book";
import { useEffect } from "react";
import { Timestamp } from "firebase/firestore";

interface BookDetailModalProps {
  selectedBook: Book | null;
  onClose: () => void;
  // モード指定: 'shelf' (本棚) または 'search' (AI検索/追加用)
  mode: ModalMode


  isEditing?: boolean;
  setIsEditing?: (val: boolean) => void;
  editScore?: number;
  setEditScore?: (val: number) => void;
  editComment?: string;
  setEditComment?: (val: string) => void;
  onUpdate?: () => void;
  showDeleteConfirm?: boolean;
  setShowDeleteConfirm?: (val: boolean) => void;
  onDelete?: () => void;
}

export const BookDetailModal = ({
  selectedBook,
  onClose,
  mode,
  isEditing = false,
  setIsEditing,
  editScore = 0,
  setEditScore,
  editComment = "",
  setEditComment,
  onUpdate,
  showDeleteConfirm = false,
  setShowDeleteConfirm,
  onDelete,
}: BookDetailModalProps) => {

  useEffect(() => {
    if (selectedBook) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden")
    }
  }, [selectedBook])

    useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        setShowDeleteConfirm?.(false)
      }
    }
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    }
  },[onClose])

  if (!selectedBook) return null;

  const description = selectedBook.caption || selectedBook.itemCaption;



  return (
    // --- モーダル全体を覆うオーバーレイ ---
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-all animate-in fade-in"
      onClick={onClose}
    >
      {/* --- モーダル本体 --- */}
      <div
        className="bg-[#F5F3EF] max-w-2xl max-h-10/12 w-full rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >

        {/* --- 左カラム：画像と削除ボタン --- */}
        <div className="w-full md:w-2/5 h-auto bg-white p-2 md:p-8 flex flex-col items-center border-r border-[#1F4D4F]/10">
          <div className="w-full h-auto max-w-45 mx-auto">
            <img
              src={selectedBook.largeImageUrl}
              className="object-cover shadow-2xl mx-auto rounded-sm"
              alt={selectedBook.title}
            />
          </div>

            {/* 登録日 */}
          {selectedBook.addedAt && (
          <div className="mt-6 flex flex-col items-center gap-1">
            <span className="text-[10px] tracking-widest text-[#1F4D4F]/40 font-bold">本棚に追加した日</span>
            <p className="text-sm text-[#1F4D4F]/80 font-medium">
              {selectedBook.addedAt instanceof Timestamp
                ? selectedBook.addedAt.toDate().toLocaleDateString("ja-JP")
                : selectedBook.addedAt instanceof Date
                  ? selectedBook.addedAt.toLocaleDateString("ja-JP")
                  : selectedBook.addedAt
              }
            </p>
          </div>
          )}


          {/* 削除ボタン */}
          <div className="mt-auto pt-3 md:pt-10 w-full flex flex-col items-center">
            {mode === 'shelf' && (
              <button
                onClick={() => setShowDeleteConfirm?.(true)}
                className="font-bold tracking-wider flex items-center gap-2 py-2 px-4 text-xs text-red-400/80 hover:text-red-600 transition-all duration-300"
              >

                <p>本棚から削除する</p>
              </button>
            )}
          </div>
        </div>

        {/* --- 削除確認ダイアログ（本棚モード時） --- */}
        {mode === 'shelf' && showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#1F4D4F]/40 backdrop-blur-[2px] animate-in fade-in"
            onClick={() => setShowDeleteConfirm?.(false)}
            >
            <div className="bg-white p-6 shadow-2xl max-w-sm w-full text-center space-y-4">
              <p className="font-bold text-[#1F4D4F]">本当にこの本を削除しますか？</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onDelete}
                  className="flex-1 bg-red-500 text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600"
                >
                  削除する
                </button>
                <button
                  onClick={() => setShowDeleteConfirm?.(false)}
                  className="flex-1 border border-gray-200 py-2 text-xs font-bold uppercase tracking-widest hover:text-[#C89B3C]"
                >
                  やめる
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 右カラム：書籍情報とアクション --- */}
        <div className="w-full md:w-3/5 p-8 flex flex-col max-h-[85vh] overflow-y-auto">
          {/* タイトル・著者 */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold leading-tight mb-1">{selectedBook.title}</h3>
            <p className="text-[#C89B3C] font-medium text-sm">{selectedBook.author}</p>
          </div>

          {/* あらすじ */}
          {description && !isEditing && (
            <div className="text-sm leading-relaxed text-[#1F4D4F]/80 mb-6 italic border-l-2 border-[#1F4D4F]/10 pl-4">
              <p className="line-clamp-8 leading-6 tracking-wide">{description}</p>
            </div>
          )}

          {/* 自分のレビュー（本棚モードかつ非編集時のみ表示） */}
          {mode === 'shelf' && !isEditing && selectedBook.comment && selectedBook.score && (
            <div className="mb-6 p-4 bg-[#C89B3C]/10 rounded-sm">
              <p className="text-[10px] font-bold text-[#C89B3C] mb-1">My Note</p>
              <p className="text-sm">★{selectedBook.score} - {selectedBook.comment}</p>
            </div>
          )}

          <div className="mt-auto space-y-4">
            {/* --- アクションエリア --- */}
            {mode === 'shelf' && isEditing ? (
              // 【本棚モード：編集フォーム】
              <div className="p-4 border border-[#C89B3C]/30 bg-white rounded-sm space-y-4">
                <div>
                  {editScore >= 1 && (<label className="text-sm font-bold block mb-2 uppercase opacity-60">SCORE: {editScore}</label>)}
                  {editScore === 0 && (<label className="text-sm font-bold block mb-2 uppercase opacity-60 text-[#1F4D4F]">未読</label>)}

                  <div className="flex gap-1 text-2xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setEditScore?.(num)}
                        className={`${num <= (editScore || 0) ? "text-[#C89B3C]" : "text-gray-200"}`}
                      >
                        ★
                      </button>
                    ))}
                    <button onClick={() => setEditScore?.(0)} className="text-sm text-gray-400 ml-2 hover:underline">未読にする</button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1 opacity-60">COMMENT</label>
                  {editScore > 0 && (
                  <textarea
                    value={editComment}
                    onChange={e => setEditComment?.(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter単体で押されたときだけ保存
                      if (e.key === 'Enter' && !e.shiftKey) {
                        if (e.nativeEvent.isComposing) return
                        e.preventDefault(); // 改行を防ぐ
                        onUpdate?.();       // 保存処理を実行
                        (e.target as HTMLElement).blur(); // キーボードを閉じる
                      }
                    }}
                    className="w-full border border-[#1F4D4F]/10 text-sm p-2 h-20 resize-none bg-white focus:outline-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C] transition-all"
                    maxLength={48}
                  />
                  )

                  }

                </div>
                <div className="flex gap-2">
                  <button onClick={onUpdate} className="flex-1 bg-[#1F4D4F] text-white py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1F4D4F]/80">保存</button>
                  <button onClick={() => setIsEditing?.(false)} className="flex-1 border border-gray-200 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#C89B3C]">キャンセル</button>
                </div>
              </div>
            ) : (
              // 【通常表示のボタンエリア】
              <div className="flex flex-col gap-3">
                {mode === 'shelf' ? (
                  // 本棚モードのボタン：編集・閉じる
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing?.(true)}
                      className="flex-1 bg-[#C89B3C] text-white py-3 text-[12px] font-bold tracking-widest hover:opacity-90"
                    >
                      {selectedBook.status === "readed" || (selectedBook.score || 0) > 0
                        ? "内容を編集する"
                        : "既読にする"
                      }
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 border border-[#1F4D4F]/20 text-[10px] font-bold rounded tracking-widest hover:text-[#C89B3C] transition-colors"
                    >
                      閉じる
                    </button>
                  </div>
                ) : (
                  // 検索・AIモードのボタン・閉じる
                  <div className="flex flex-col gap-2">
                    <div className="w-full mx-auto text-center">
                      {mode === 'search' && (<AddShelfWithReview book={selectedBook} onClose={onClose} /> )}
                      {mode === 'ai' && (<AddShelfButton book={selectedBook} onClose={onClose}/>)}

                    </div>
                    <button
                      onClick={onClose}
                      className="w-full py-2 text-[12px] font-bold text-[#1F4D4F]/40 hover:text-[#1F4D4F] uppercase tracking-widest transition-colors"
                    >
                      閉じる
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 外部詳細リンク */}
            {selectedBook.itemUrl && !isEditing && (
              <Link
                target="blank"
                href={selectedBook.itemUrl}
                className="block text-center text-[10px] font-bold text-[#1F4D4F]/40 hover:text-[#1F4D4F] transition-colors tracking-[0.2em]"
              >
                詳細(外部ページ) ↗
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
