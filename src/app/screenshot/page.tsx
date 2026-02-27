"use client";
import { getMyShelf } from "@/lib/booksDb";
import { auth } from "@/lib/firebase";
import { Book } from "@/types/book";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function ScreenShotPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C89B3C] border-t-transparent" />
      </div>
    );

  const readedBooks = books.filter(
    (b) => b.status === "readed" || (b.score && b.score > 0),
  );

  const lenge = readedBooks.length;

  return (
    <>
      <section className="my-10 w-full overflow-hidden p-5">
        <header className="mb-5 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold text-[#1F4D4F]">
            Shelfie
          </h1>
          <div className="mx-auto h-1 w-12 bg-[#C89B3C]" />
        </header>
        <div className="grid w-full grid-cols-[repeat(auto-fit,_minmax(46px,_1fr))] gap-0.5">
          {books.map((book) => (
            <div
              key={book.isbn}
              className="relative mx-auto h-16 w-12 overflow-hidden rounded bg-white shadow-sm"
            >
              <Image
                src={book.largeImageUrl || ""}
                alt=""
                fill
                sizes="100px"
                className="object-cover shadow-md"
                loading="eager"
              />
            </div>
          ))}
        </div>
        <div className="mt-50 p-10">
          <Link href="/myShelf" className="text-blue-400 underline">
            ←Back
          </Link>
        </div>
      </section>
    </>
  );
}

export default ScreenShotPage;
