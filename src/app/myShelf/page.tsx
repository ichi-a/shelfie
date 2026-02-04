'use client';

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getMyShelf, updateBookStatus, deleteBookFromDb } from "@/lib/booksDb";
import { toast } from "sonner";
import { BookDetailModal } from "@/components/ui/BookDetailModal";
import { Book, BookStatus } from "@/types/book";

export default function MyShelf() {

  type Sort = "addedAt" | "author" | "salesDate" |"score";
  // --- 状態管理 (State) ---
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortType, setSortType] = useState<Sort>("addedAt");



  // --- データ取得ロジック ---
  const fetchBooks = async (uid: string) => {
    try {
      const data = await getMyShelf(uid);
      setBooks(data);
    } catch (error) {
      toast.error("データの取得に失敗しました");
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchBooks(user.uid);
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
    const user = auth.currentUser;
    if (!user || !selectedBook) return;

    // 未読にするなら status="unread" かつ コメント空、そうでなければ "readed"
    const isSettingToUnread = editScore === 0;
    const newStatus: BookStatus  = (isSettingToUnread ? "unread" : "readed");
    const newComment = isSettingToUnread ? "" : editComment;

    try {
      await updateBookStatus(user.uid, selectedBook.isbn, {
        score: editScore,
        comment: newComment,
        status: newStatus,
      });

      // ローカルStateの即時書き換え
      const updatedList: Book[] = books.map(b =>
        b.isbn === selectedBook.isbn
          ? { ...b, score: editScore, comment: newComment, status: newStatus }
          : b
      );
      setBooks(updatedList);

      toast.success(isSettingToUnread ? "Reading listに移動しました" : "更新しました");

      // 更新が終わったらモーダルを閉じる
      setIsEditing(false);
      setSelectedBook(null);
    } catch (e) {
      toast.error("更新失敗");
      console.error(e)
    }
  };

  const handleDelete = async () => {
    const user = auth.currentUser;
    if (!user || !selectedBook) return;
    try {
      await deleteBookFromDb(user.uid, selectedBook.isbn);
      setBooks(books.filter(b => b.isbn !== selectedBook.isbn));
      setSelectedBook(null);
      setShowDeleteConfirm(false);
      toast.success(`${selectedBook.title}を本棚から削除しました`)
    } catch (e) {
      toast.error("削除失敗");
      console.error(e)
    }
  };


  //Sortロジック
  const sortBooks = [...books].sort((a, b) => {
    if (sortType === "author") return a.author.localeCompare(b.author)
    if (sortType === "score") return (b.score ?? 0) - (a.score ?? 0)
    if (sortType === "salesDate") return (b.salesDate ?? "").localeCompare(a.salesDate ?? "")
    if (sortType === "addedAt") return 0
    return 0
  })

  // セクション分け判定
  const readBooks = sortBooks.filter(b => b.status === "readed" || (b.score && b.score > 0));
  const unreadBooks = books.filter(b => b.status === "unread" || (!b.status && (!b.score || b.score === 0)));

  if (loading) return <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#C89B3C] border-t-transparent rounded-full" /></div>;




  return (
    <main className="min-h-screen bg-[#F5F3EF] text-[#1F4D4F] pb-20 pt-12">
      <div className="container mx-auto p-5">
        <header className="text-center mb-16">
          <h1 className="text-3xl font-serif font-bold mb-2">My Library</h1>
          <div className="h-1 w-12 bg-[#C89B3C] mx-auto" />
        </header>

        <div className="max-w-7xl mx-auto space-y-16">
          {readBooks.length > 0 && (
            <section>
                  <div>
                    <div className="flex gap-3 italic mb-2 text-[#1F4D4F] text-sm p-1 font-semibold transition-all">
                      <div className={`p-1 cursor-pointer ${sortType === "addedAt" && "border-b-2  border-[#C89B3C]"}`} onClick={() => setSortType("addedAt")}>
                        登録日順</div>
                      <div className={`p-1 cursor-pointer ${sortType === "author" && "border-b-2  border-[#C89B3C]"}`} onClick={() => setSortType("author")}>
                        作者順</div>
                      <div className={`p-1 cursor-pointer ${sortType === "salesDate" && "border-b-2  border-[#C89B3C]"}`} onClick={() => setSortType("salesDate")}>
                        発売日順</div>
                      <div className={`p-1 cursor-pointer ${sortType === "score" && "border-b-2  border-[#C89B3C]"}`} onClick={() => setSortType("score")}>
                        評価順</div>
                    </div>
                  </div>
              <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {readBooks.map(book => (
                  <div key={book.isbn} onClick={() => openModal(book)} className="relative m-3 z-1 cursor-pointer group rounded mx-auto min-w-33 min-h-49.5 shadow-xl">
                    {/* {sortType === "author" && (<div className="line-clamp-1 rounded bg-black/40 text-white text-[9px] px-1 font-bold">{book.author}</div>)} */}
                    <img src={book.largeImageUrl} className="w-full h-full group-hover:-translate-y-1 transition-transform object-cover"/>
                    {sortType === "score" && (<div className="absolute top-0 right-0 bg-[#C89B3C] text-white text-[9px] px-1 font-bold">★{book.score}</div>)}
                    {sortType === "salesDate" && (<div className="absolute top-0 right-0 line-clamp-1 rounded bg-black/30 text-white text-[9px] px-1 font-bold">{book.salesDate}</div>)}
                    {sortType === "author" && (<div className="text-center line-clamp-1 rounded text-[#1F4D4F] text-[9px] px-1 mt-2 font-bold">{book.author}</div>)}
                    {/* 本を置いてる感 */}
                    {/* <div className="-z-10 h-1.5 absolute -right-4 -left-4 bg-amber-800"></div> */}
                  </div>

                ))}
              </div>
            </section>
          )}

          {unreadBooks.length > 0 && (
            <section>
              <h2 className="border-b-2 border-[#C89B3C] w-32 pb-1 mb-3 text-[#1F4D4F] font-serif font-bold">Reading list</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {unreadBooks.map(book => (
                  <div key={book.isbn} onClick={() => openModal(book)} className="cursor-pointer group">
                    <img src={book.largeImageUrl} className="shadow-md group-hover:-translate-y-1 transition-transform border border-black/5" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        {}

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
