import { doc, setDoc, serverTimestamp,deleteDoc, updateDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
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
  userId: string,
  item: Book,
  score?: number,
  comment?: string,
  status: "readed" | "unread" = "unread"
  ) {
  if (!userId || !item.isbn) return;

  // ユーザーごとの専用パスを作成
  const shelfRef = doc(db, "users", userId, "myShelf", item.isbn);

  const shelfData = {
    isbn: item.isbn,
    title: item.title,
    author: item.author,
    largeImageUrl: item.largeImageUrl,
    addedAt: serverTimestamp(), // 本棚に追加した日時
    status: status, // 読書状態（未読/既読など）の初期値 unread
    score: score || 0,       // 点数（未入力なら0）
    comment: comment || "",  // 感想（未入力なら空文字）
    caption: item.itemCaption || "",
    itemUrl: item.itemUrl,
    publisherName: item.publisherName,
    salesDate: item.salesDate,
    booksGenreId: item.booksGenreId,
    reviewAverage: item.reviewAverage,
    reviewCount: item.reviewCount,
  };

  try {
    // ユーザー専用の本棚に書き込み
    await setDoc(shelfRef, shelfData);
    console.log("マイ本棚に登録完了！");
  } catch (e) {
    console.error("マイ本棚保存失敗:", e);
    toast.error("本棚に登録失敗")
    throw e; // エラーを呼び出し元に伝えてalertなどを出せるようにする
  }
}


//  指定したユーザーの本棚を全件取得する
export const getMyShelf = async (userId: string): Promise<Book[]> => {
  const shelfRef = collection(db, "users", userId, "myShelf");

  // 「追加した順」に並べたい
  const q = query(shelfRef, orderBy("addedAt", "desc"));

  const querySnapshot = await getDocs(q);

  // Snapshotを普通の配列に変換して返す
  return querySnapshot.docs.map(doc => ({...doc.data()} as Book));
};


export const updateBookStatus = async (
  userId: string,
  isbn: string,
  updates: { score?: number | null | undefined; comment?: string; status?: "readed" | "unread" }
) => {
  const shelfRef = doc(db, "users", userId, "myShelf", isbn);

  try {
    await updateDoc(shelfRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error("更新失敗:", e);
    toast.error("更新失敗")
    throw e;
  }
};

// 本を削除する
export const deleteBookFromDb = async (userId: string, isbn: string) => {
  const bookRef = doc(db, "users", userId, "myShelf", isbn);
  return await deleteDoc(bookRef);
};
