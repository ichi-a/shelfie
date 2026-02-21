import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "sonner";
import { Book } from "@/types/book";

/**
 * 楽天APIのデータをバックグラウンドで保存する
 */
export async function saveBookToDb(item: Book) {
  if (!item || !item.isbn) return;

  const bookRef = doc(db, "books", item.isbn);

  const bookData = {
    isbn: item.isbn,
    title: item.title,
    author: item.author,
    largeImageUrl: item.largeImageUrl,
    itemUrl: item.itemUrl,
    caption: item.itemCaption || "",
    publisherName: item.publisherName || "",
    salesDate: item.salesDate || "",
    affiliateUrl: item.affiliateUrl || "",
    updatedAt: serverTimestamp(),
    booksGenreId: item.booksGenreId,
    reviewAverage: item.reviewAverage,
    reviewCount: item.reviewCount,
  };

  try {
    // すでに存在していても最新情報で上書き（更新）
    await setDoc(bookRef, bookData, { merge: true });
  } catch (e) {
    console.error("DB保存失敗:", e);
  }
}
/**
 *
 * addToMyShelf: ログイン中のユーザー専用の本棚（サブコレクション）に保存します。
 * 階層：users(コレ) > {userId}(ドキュ) > myShelf(サブコレ) > {isbn}(ドキュ)
 */
export async function addToMyShelf(
  item: Book,
  score?: number,
  comment?: string,
  status: "readed" | "unread" = "unread",
) {
  try {
    // ユーザー専用の本棚に書き込み
    const res = await fetch("/api/shelf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, score, comment, status }),
    });
    if (!res.ok) throw new Error("保存に失敗しました");
  } catch (e) {
    console.error("マイ本棚保存失敗:", e);
    toast.error("本棚に登録失敗");
    throw e; // エラーを呼び出し元に伝えてalertなどを出せるようにする
  }
}

//  指定したユーザーの本棚を全件取得する
export const getMyShelf = async (): Promise<Book[]> => {
  const res = await fetch("/api/shelf");
  if (!res.ok) throw new Error("本棚の取得に失敗しました");
  return res.json();
};

//更新
export const updateBookStatus = async (
  isbn: string,
  updates: {
    score?: number | null;
    comment?: string;
    status?: "readed" | "unread";
  },
) => {
  const res = await fetch("/api/shelf", {
    method: "PATCH",
    body: JSON.stringify({ isbn, ...updates }),
  });

  if (!res.ok) {
    toast.error("更新失敗");
    throw new Error("更新失敗");
  }
};

// 本を削除する
export const deleteBookFromDb = async (isbn: string) => {
  const res = await fetch("/api/shelf", {
    method: "DELETE",
    body: JSON.stringify({ isbn }),
  });

  if (!res.ok) {
    toast.error("削除失敗");
    throw new Error("削除失敗");
  }
};
