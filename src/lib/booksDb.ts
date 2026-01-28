import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 楽天APIのデータをバックグラウンドで保存する
 */
export async function saveBookToDb(item: any) {
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
  };

  try {
    // すでに存在していても最新情報で上書き（更新）
    await setDoc(bookRef, bookData, { merge: true });
  } catch (e) {
    console.error("DB保存失敗:", e);
  }
}
