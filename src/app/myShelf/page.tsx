"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getMyShelf, updateBookStatus, deleteBookFromDb } from "@/lib/booksDb";
import { toast } from "sonner";
import { BookDetailModal } from "@/components/ui/BookDetailModal";
import { Book, BookStatus } from "@/types/book";
import Image from "next/image";

export default function MyShelf() {
  type Sort = "addedAt" | "author" | "salesDate" | "score";
  // --- 状態管理 (State) ---
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortType, setSortType] = useState<Sort>("addedAt");

  const user = auth.currentUser;

  // --- データ取得ロジック ---
  const fetchBooks = async () => {
    try {
      const data = await getMyShelf();
      setBooks(data);
    } catch (error) {
      toast.error("データの取得に失敗しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchBooks();
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- ハンドラ ---
  const openModal = (book: Book) => {
    setSelectedBook(book);
    setEditScore(book.score || 0);
    setEditComment(book.comment || "");
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!selectedBook) return;

    // 未読にするなら status="unread" かつ コメント空、そうでなければ "readed"
    const isSettingToUnread = editScore === 0;
    const newStatus: BookStatus = isSettingToUnread ? "unread" : "readed";
    const newComment = isSettingToUnread ? "" : editComment;

    try {
      await updateBookStatus(selectedBook.isbn, {
        score: editScore,
        comment: newComment,
        status: newStatus,
      });

      // ローカルStateの即時書き換え
      const updatedList: Book[] = books.map((b) =>
        b.isbn === selectedBook.isbn
          ? { ...b, score: editScore, comment: newComment, status: newStatus }
          : b,
      );
      setBooks(updatedList);

      toast.success(
        isSettingToUnread ? "Reading listに移動しました" : "更新しました",
      );

      // 更新が終わったらモーダルを閉じる
      setIsEditing(false);
      setSelectedBook(null);
    } catch (e) {
      toast.error("更新失敗");
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      await deleteBookFromDb(selectedBook.isbn);
      setBooks(books.filter((b) => b.isbn !== selectedBook.isbn));
      setSelectedBook(null);
      setShowDeleteConfirm(false);
      toast.success(`${selectedBook.title}を本棚から削除しました`);
    } catch (e) {
      toast.error("削除失敗");
      console.error(e);
    }
  };

  //Sortロジック
  const sortBooks = [...books].sort((a, b) => {
    if (sortType === "author") return a.author.localeCompare(b.author);
    if (sortType === "score") return (b.score ?? 0) - (a.score ?? 0);
    if (sortType === "salesDate")
      return (b.salesDate ?? "").localeCompare(a.salesDate ?? "");
    if (sortType === "addedAt") return 0;
    return 0;
  });

  // セクション分け判定
  const readBooks = sortBooks.filter(
    (b) => b.status === "readed" || (b.score && b.score > 0),
  );
  const unreadBooks = books.filter(
    (b) => b.status === "unread" || (!b.status && (!b.score || b.score === 0)),
  );

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C89B3C] border-t-transparent" />
      </div>
    );

  return (
    <main className="min-h-screen bg-[#F5F3EF] pt-12 pb-20 text-[#1F4D4F]">
      <div className="container mx-auto p-5">
        <header className="mb-16 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold">My Library</h1>
          <div className="mx-auto h-1 w-12 bg-[#C89B3C]" />
        </header>
        {user ? (
          <div className="mx-auto max-w-7xl space-y-16">
            {readBooks.length > 0 && (
              <section>
                <div>
                  <div className="mb-2 flex gap-3 p-1 text-sm font-semibold text-[#1F4D4F] italic transition-all">
                    <div
                      className={`cursor-pointer p-1 ${sortType === "addedAt" && "border-b-2 border-[#C89B3C]"}`}
                      onClick={() => setSortType("addedAt")}
                    >
                      登録日順
                    </div>
                    <div
                      className={`cursor-pointer p-1 ${sortType === "author" && "border-b-2 border-[#C89B3C]"}`}
                      onClick={() => setSortType("author")}
                    >
                      作者順
                    </div>
                    <div
                      className={`cursor-pointer p-1 ${sortType === "salesDate" && "border-b-2 border-[#C89B3C]"}`}
                      onClick={() => setSortType("salesDate")}
                    >
                      発売日順
                    </div>
                    <div
                      className={`cursor-pointer p-1 ${sortType === "score" && "border-b-2 border-[#C89B3C]"}`}
                      onClick={() => setSortType("score")}
                    >
                      評価順
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                  {readBooks.map((book) => (
                    <div
                      key={book.isbn}
                      onClick={() => openModal(book)}
                      className="group group z-1 m-3 mx-auto flex min-h-49.5 min-w-33 transform cursor-pointer flex-col overflow-hidden rounded bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* {sortType === "author" && (<div className="line-clamp-1 rounded bg-black/40 text-white text-[9px] px-1 font-bold">{book.author}</div>)} */}
                      <div className="relative flex-1 overflow-hidden bg-[#1F4D4F]/30">
                        <Image
                          src={book.largeImageUrl || ""}
                          alt=""
                          fill
                          sizes="198px"
                          priority
                          onLoad={(event) => {
                            const target = event.target as HTMLImageElement;
                            if (
                              target.src.indexOf("data:image/gif;base64") < 0
                            ) {
                              target.classList.remove("opacity-0");
                            }
                          }}
                          className="animate-in fade-in fill-mode-forwards object-cover opacity-0 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1F4D4F]/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1F4D4F] shadow-lg">
                            詳細をみる
                          </span>
                        </div>
                        {sortType === "score" && (
                          <div className="absolute top-0 right-0 z-10 bg-[#C89B3C] px-1 text-[9px] font-bold text-white">
                            ★{book.score}
                          </div>
                        )}
                        {sortType === "salesDate" && (
                          <div className="absolute top-0 right-0 z-10 line-clamp-1 rounded bg-black/30 px-1 text-[9px] font-bold text-white">
                            {book.salesDate}
                          </div>
                        )}
                      </div>

                      {sortType === "author" && (
                        <div className="z-10 mt-2 mb-1 line-clamp-1 rounded px-1 text-center text-[11px] font-bold text-[#1F4D4F] group-hover:text-[#C89B3C]">
                          {book.author}
                        </div>
                      )}

                      {/* 本を置いてる感 */}
                      {/* <div className="-z-10 h-1.5 absolute -right-4 -left-4 bg-amber-800"></div> */}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {unreadBooks.length > 0 && (
              <section>
                <h2 className="mb-3 w-32 border-b-2 border-[#C89B3C] pb-1 font-serif font-bold text-[#1F4D4F]">
                  Reading list
                </h2>
                <div className="grid grid-cols-2 gap-6 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                  {unreadBooks.map((book) => (
                    <div
                      key={book.isbn}
                      onClick={() => openModal(book)}
                      className="group group group relative z-1 m-3 mx-auto flex min-h-49.5 min-w-33 transform cursor-pointer flex-col overflow-hidden rounded bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <Image
                        src={book.largeImageUrl || ""}
                        alt=""
                        fill
                        sizes="198px"
                        className="object-cover shadow-md transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1F4D4F]/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1F4D4F] shadow-lg">
                          詳細をみる
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-[#1F4D4F]">
              Welcome to <span className="text-[#C89B3C]">Shelfie</span>
            </h2>
            <p className="mb-10 max-w-xs text-sm text-[#1F4D4F]/60">
              ログインしてShelfieを楽しんでください！
            </p>
          </div>
        )}

        <BookDetailModal
          mode="shelf"
          selectedBook={selectedBook}
          onClose={() => setSelectedBook(null)}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editScore={editScore}
          setEditScore={setEditScore}
          editComment={editComment}
          setEditComment={setEditComment}
          onUpdate={handleUpdate}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
