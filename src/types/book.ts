import { Timestamp } from "firebase/firestore";

export type BookStatus = "readed" | "unread";

export interface Book {
  isbn: string;
  title: string;
  author: string;
  largeImageUrl?: string;
  itemUrl?: string;
  // データの出所によって名前が違うあらすじを許容
  caption?: string;
  itemCaption?: string;
  // 本棚に保存された時のみ存在するプロパティ
  score?: number | undefined;
  comment?: string;
  publisherName?: string
  salesDate?: string
  affiliateUrl?: string
  booksGenreId?: string
  reviewAverage?: string
  reviewCount?: string
  addedAt?: string | Timestamp | Date
  status?: BookStatus
}


// モーダルのモード定義
export type ModalMode = 'shelf' | 'search' | 'ai';

export interface Ai {
  librarianSummary: string
  recommendedBooks: Book[]
}
