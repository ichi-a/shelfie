"use client";
import { getMyShelf } from "@/lib/booksDb";
import { auth } from "@/lib/firebase";
import { Book } from "@/types/book";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

type Sort = "addedAt" | "author" | "salesDate" | "score";

function calcGridLayout(
  bookCount: number,
  containerWidth: number,
  containerHeight: number,
  gap = 2,
) {
  if (bookCount === 0) return { cols: 1, itemWidth: 46, itemHeight: 64 };

  const BOOK_ASPECT = 64 / 48;
  let bestCols = 1;
  let bestItemWidth = 0;

  for (let cols = 1; cols <= bookCount; cols++) {
    const rows = Math.ceil(bookCount / cols);
    const itemW = (containerWidth - gap * (cols - 1)) / cols;
    const itemH = (containerHeight - gap * (rows - 1)) / rows;

    // 縦横どちらかがはみ出さないよう小さい方に合わせる
    const sizeByWidth = itemW;
    const sizeByHeight = itemH / BOOK_ASPECT;
    const itemWidth = Math.min(sizeByWidth, sizeByHeight);

    if (itemWidth > bestItemWidth) {
      bestItemWidth = itemWidth;
      bestCols = cols;
    }
  }

  return {
    cols: bestCols,
    itemWidth: Math.floor(bestItemWidth),
    itemHeight: Math.floor(bestItemWidth * BOOK_ASPECT),
  };
}

function ScreenShotPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<Sort>("addedAt");
  const [layout, setLayout] = useState({
    cols: 4,
    itemWidth: 48,
    itemHeight: 64,
  });

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

  const updateLayout = useCallback(() => {
    const RESERVED_HEIGHT = 120;
    const w = window.innerWidth - 40; // padding分
    const h = window.innerHeight - RESERVED_HEIGHT;
    setLayout(calcGridLayout(books.length, w, h));
  }, [books.length]);

  useEffect(() => {
    if (books.length === 0) return;
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [books.length, updateLayout]);

  //Sortロジック
  const sortBooks = [...books].sort((a, b) => {
    if (sortType === "author") return a.author.localeCompare(b.author);
    if (sortType === "score") return (b.score ?? 0) - (a.score ?? 0);
    if (sortType === "salesDate")
      return (b.salesDate ?? "").localeCompare(a.salesDate ?? "");
    if (sortType === "addedAt") return 0;
    return 0;
  });

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C89B3C] border-t-transparent" />
      </div>
    );

  return (
    <section className="flex min-h-screen flex-col p-5">
      <header className="mb-5 text-center">
        <h1 className="my-2 font-serif text-3xl font-bold text-[#1F4D4F]">
          Shelfie
        </h1>
        <div className="mx-auto h-1 w-12 bg-[#C89B3C]" />
      </header>

      <div className="mt-2 flex flex-1 items-center justify-center">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${layout.cols}, ${layout.itemWidth}px)`,
            gap: "2px",
          }}
        >
          {sortBooks.map((book) => (
            <div
              key={book.isbn}
              style={{ width: layout.itemWidth, height: layout.itemHeight }}
              className="relative overflow-hidden rounded bg-[#1F4D4F]/30 shadow-sm"
            >
              <Image
                src={book.largeImageUrl || ""}
                alt=""
                fill
                sizes={`${layout.itemWidth}px`}
                className="object-cover shadow-md"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-30 flex justify-center lg:mt-40">
        <div className="mb-2 flex gap-1 p-1 text-sm font-semibold text-[#1F4D4F] italic transition-all min-[380px]:gap-3">
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

      <div className="mt-15 p-4">
        <Link href="/myShelf" className="text-blue-400 underline">
          ←Back
        </Link>
      </div>
    </section>
  );
}

export default ScreenShotPage;
