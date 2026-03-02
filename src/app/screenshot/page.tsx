"use client";
import { getMyShelf } from "@/lib/booksDb";
import { auth } from "@/lib/firebase";
import { Book } from "@/types/book";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

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

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C89B3C] border-t-transparent" />
      </div>
    );

  return (
    <section className="flex min-h-screen flex-col p-5">
      <header className="mb-5 text-center">
        <h1 className="mb-2 font-serif text-3xl font-bold text-[#1F4D4F]">
          Shelfie
        </h1>
        <div className="mx-auto h-1 w-12 bg-[#C89B3C]" />
      </header>

      <div className="flex flex-1 items-center justify-center">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${layout.cols}, ${layout.itemWidth}px)`,
            gap: "2px",
          }}
        >
          {books.map((book) => (
            <div
              key={book.isbn}
              style={{ width: layout.itemWidth, height: layout.itemHeight }}
              className="relative overflow-hidden rounded bg-white shadow-sm"
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

      <div className="mt-30 p-4">
        <Link href="/myShelf" className="text-blue-400 underline">
          ←Back
        </Link>
      </div>
    </section>
  );
}

export default ScreenShotPage;
