"use client";

import Link from "next/link";
import { AddShelfWithReview } from "./AddShelfWithReview";
import { AddShelfButton } from "./AddShelfButton";
import { Book, ModalMode } from "@/types/book";
import { useEffect } from "react";
import Image from "next/image";

interface BookDetailModalProps {
  selectedBook: Book | null;
  onClose: () => void;
  // モード指定: 'shelf' | 'search' | 'ai'
  mode: ModalMode;

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
      document.body.classList.remove("overflow-hidden");
    }
  }, [selectedBook]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        setShowDeleteConfirm?.(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  if (!selectedBook) return null;

  const description = selectedBook.caption || selectedBook.itemCaption;

  return (
    // --- モーダル全体を覆うオーバーレイ ---
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      {/* --- モーダル本体 --- */}
      <div
        className="animate-in zoom-in flex max-h-10/12 w-full max-w-2xl flex-col overflow-hidden rounded-sm bg-[#F5F3EF] shadow-2xl duration-200 md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- 左カラム：画像と削除ボタン --- */}
        <div className="flex h-auto min-h-58 w-full flex-col items-center border-r border-[#1F4D4F]/10 p-2 md:w-2/5 md:p-8">
          <div className="relative mx-auto min-h-40 w-40 md:w-50">
            <Image
              src={selectedBook.largeImageUrl || ""}
              className="mx-auto rounded-sm object-contain shadow-2xl"
              alt={selectedBook.title}
              width={0} // 一旦0にする（または目安の数値）
              height={0} // 一旦0にする
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {/* 登録日 */}
          {selectedBook.addedAt && (
            <div className="mt-6 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold tracking-widest text-[#1F4D4F]/40">
                本棚に追加した日
              </span>
              <p className="text-sm font-medium text-[#1F4D4F]/80">
                {typeof selectedBook.addedAt === "object" &&
                "_seconds" in selectedBook.addedAt
                  ? new Date(
                      (selectedBook.addedAt._seconds as number) * 1000,
                    ).toLocaleDateString("ja-JP")
                  : selectedBook.addedAt instanceof Date
                    ? selectedBook.addedAt.toLocaleDateString("ja-JP")
                    : String(selectedBook.addedAt)}
              </p>
            </div>
          )}

          {/* 削除ボタン */}
          <div className="mt-auto flex w-full flex-col items-center pt-3 md:pt-10">
            {mode === "shelf" && (
              <button
                onClick={() => setShowDeleteConfirm?.(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider text-red-400/80 transition-all duration-300 hover:text-red-600"
              >
                <p>本棚から削除する</p>
              </button>
            )}
          </div>
        </div>

        {/* --- 削除確認ダイアログ（本棚モード時） --- */}
        {mode === "shelf" && showDeleteConfirm && (
          <div
            className="animate-in fade-in fixed inset-0 z-60 flex items-center justify-center bg-[#1F4D4F]/40 p-4 backdrop-blur-[2px]"
            onClick={() => setShowDeleteConfirm?.(false)}
          >
            <div className="w-full max-w-sm space-y-4 bg-white p-6 text-center shadow-2xl">
              <p className="font-bold text-[#1F4D4F]">
                本当にこの本を削除しますか？
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={onDelete}
                  className="flex-1 bg-red-500 py-2 text-xs font-bold tracking-widest text-white uppercase hover:bg-red-600"
                >
                  削除する
                </button>
                <button
                  onClick={() => setShowDeleteConfirm?.(false)}
                  className="flex-1 border border-gray-200 py-2 text-xs font-bold tracking-widest uppercase hover:text-[#C89B3C]"
                >
                  やめる
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 右カラム：書籍情報とアクション --- */}
        <div className="flex max-h-[85vh] w-full flex-col overflow-y-auto p-8 md:w-3/5">
          {/* タイトル・著者 */}
          <div className="mb-4">
            <h3 className="mb-1 text-2xl leading-tight font-bold">
              {selectedBook.title}
            </h3>
            <p className="text-sm font-medium text-[#C89B3C]">
              {selectedBook.author}
            </p>
          </div>

          {/* あらすじ */}
          {description && !isEditing && (
            <div className="mb-6 border-l-2 border-[#1F4D4F]/10 pl-4 text-sm leading-relaxed text-[#1F4D4F]/80 italic">
              <p className="line-clamp-8 leading-6 tracking-wide">
                {description}
              </p>
            </div>
          )}

          {/* 自分のレビュー（本棚モードかつ非編集時のみ表示） */}
          {mode === "shelf" &&
            !isEditing &&
            selectedBook.comment &&
            selectedBook.score && (
              <div className="mb-6 rounded-sm bg-[#C89B3C]/10 p-4">
                <p className="mb-1 text-[10px] font-bold text-[#C89B3C]">
                  My Note
                </p>
                <p className="text-sm">
                  ★{selectedBook.score} - {selectedBook.comment}
                </p>
              </div>
            )}

          <div className="mt-auto space-y-4">
            {/* --- アクションエリア --- */}
            {mode === "shelf" && isEditing ? (
              // 【本棚モード：編集フォーム】
              <div className="space-y-4 rounded-sm border border-[#C89B3C]/30 bg-white p-4">
                <div>
                  {editScore >= 1 && (
                    <label className="mb-2 block text-sm font-bold text-[#C89B3C] uppercase">
                      <span className="text-sm font-medium text-[#1F4D4F]/70">
                        SCORE:{" "}
                      </span>
                      {editScore}
                    </label>
                  )}
                  {editScore === 0 && (
                    <label className="mb-2 block text-sm font-bold text-[#C89B3C] uppercase">
                      <span className="text-sm font-medium text-[#1F4D4F]/70">
                        SCORE:{" "}
                      </span>
                      未読
                    </label>
                  )}

                  <div className="flex cursor-pointer gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setEditScore?.(num)}
                        className={`${num <= (editScore || 0) ? "text-[#C89B3C]" : "text-gray-200"} hover:scale-[1.1] active:text-[#C89B3C]`}
                      >
                        ★
                      </button>
                    ))}
                    {!editScore || !selectedBook.score ? (
                      <p className="ml-2 text-sm text-gray-400 hover:underline"></p>
                    ) : (
                      <button
                        onClick={() => setEditScore?.(0)}
                        className="ml-2 text-sm text-gray-400 hover:underline"
                      >
                        未読にする
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold opacity-60">
                    COMMENT
                  </label>
                  {editScore > 0 && (
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment?.(e.target.value)}
                      onKeyDown={(e) => {
                        // Enter単体で押されたときだけ保存
                        if (e.key === "Enter" && !e.shiftKey) {
                          if (e.nativeEvent.isComposing) return;
                          e.preventDefault(); // 改行を防ぐ
                          onUpdate?.(); // 保存処理を実行
                          (e.target as HTMLElement).blur(); // キーボードを閉じる
                        }
                      }}
                      className="h-20 w-full resize-none border border-[#1F4D4F]/10 bg-white p-2 text-sm transition-all focus:ring-1 focus:ring-[#C89B3C] focus:outline-[#C89B3C]"
                      maxLength={48}
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onUpdate}
                    className="flex-1 bg-[#1F4D4F] py-2 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-[#1F4D4F]/80"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditing?.(false)}
                    className="flex-1 border border-gray-200 py-2 text-[10px] font-bold tracking-widest uppercase hover:text-[#C89B3C]"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              // 【通常表示のボタンエリア】
              <div className="flex flex-col gap-3">
                {mode === "shelf" ? (
                  // 本棚モードのボタン：編集・閉じる
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing?.(true)}
                      className="flex-1 bg-[#C89B3C] py-3 text-[12px] font-bold tracking-widest text-white hover:opacity-90"
                    >
                      {selectedBook.status === "readed" ||
                      (selectedBook.score || 0) > 0
                        ? "内容を編集する"
                        : "既読にする"}
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded border border-[#1F4D4F]/20 px-6 py-3 text-[10px] font-bold tracking-widest transition-colors hover:text-[#C89B3C]"
                    >
                      閉じる
                    </button>
                  </div>
                ) : (
                  // 検索・AIモードのボタン・閉じる
                  <div className="flex flex-col gap-2">
                    <div className="mx-auto w-full text-center">
                      {mode === "search" && (
                        <AddShelfWithReview
                          book={selectedBook}
                          onClose={onClose}
                        />
                      )}
                      {mode === "ai" && (
                        <AddShelfButton book={selectedBook} onClose={onClose} />
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="w-full py-2 text-[12px] font-bold tracking-widest text-[#1F4D4F]/40 uppercase transition-colors hover:text-[#1F4D4F]"
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
                className="block text-center text-[10px] font-bold tracking-[0.2em] text-[#1F4D4F]/40 transition-colors hover:text-[#1F4D4F]"
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
