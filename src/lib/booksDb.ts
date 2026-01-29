import { doc, setDoc, serverTimestamp, updateDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
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
/**
 * 【解説】
 * addToMyShelf: ログイン中のユーザー専用の本棚（サブコレクション）に保存します。
 * 階層：users(コレ) > {userId}(ドキュ) > myShelf(サブコレ) > {isbn}(ドキュ)
 */
export async function addToMyShelf(userId: string, item: any, score?: number, comment?: string) {
  if (!userId || !item.isbn) return;

  // ユーザーごとの専用パスを作成
  const shelfRef = doc(db, "users", userId, "myShelf", item.isbn);

  const shelfData = {
    isbn: item.isbn,
    title: item.title,
    author: item.author,
    largeImageUrl: item.largeImageUrl,
    addedAt: serverTimestamp(), // 本棚に追加した日時
    status: "readed", // 読書状態（未読/既読など）の初期値 unread
    score: score || 0,       // 点数（未入力なら0）
    comment: comment || "",  // 感想（未入力なら空文字）
  };

  try {
    // ユーザー専用の本棚に書き込み
    await setDoc(shelfRef, shelfData);
    console.log("マイ本棚に登録完了！");
  } catch (e) {
    console.error("マイ本棚保存失敗:", e);
    throw e; // エラーを呼び出し元に伝えてalertなどを出せるようにする
  }
}


// 例: 指定したユーザーの本棚を全件取得する
export const getMyShelf = async (userId: string) => {
  const shelfRef = collection(db, "users", userId, "myShelf");

  // せっかくなら「追加した順」に並べたいですよね
  const q = query(shelfRef, orderBy("addedAt", "desc"));

  const querySnapshot = await getDocs(q);

  // Snapshotを普通の配列に変換して返す
  return querySnapshot.docs.map(doc => doc.data());
};


export const updateBookStatus = async (
  userId: string,
  isbn: string,
  updates: { status: string; score?: number; comment?: string }
) => {
  const shelfRef = doc(db, "users", userId, "myShelf", isbn);

  try {
    await updateDoc(shelfRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error("更新失敗:", e);
    throw e;
  }
};
