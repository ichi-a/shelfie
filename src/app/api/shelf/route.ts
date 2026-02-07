import { adminAuth, adminDb } from "@/lib/firebaseAdmin"; // adminDbをインポート
import * as admin from "firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decodedClaims = await adminAuth.verifySessionCookie(session);
    const userId = decodedClaims.uid;

    const body = await req.json();
    console.log("RECEIVE_BODY:", body);
    const { item, score, comment, status } = body;

    // item.isbn が存在するかチェック（念のため）
    if (!item?.isbn) {
      console.error("VALIDATION_FAILED: item or isbn is missing");
      return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
    }

    // ★ adminDb を使う
    const shelfRef = adminDb.collection("users").doc(userId).collection("myShelf").doc(item.isbn);

    await shelfRef.set({
      isbn: item.isbn,
      title: item.title,
      author: item.author,
      largeImageUrl: item.largeImageUrl,
      addedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: status || "unread",
      score: score || 0,
      comment: comment || "",
      caption: item.itemCaption || "",
      itemUrl: item.itemUrl || "",
      publisherName: item.publisherName || "",
      salesDate: item.salesDate || "",
      booksGenreId: item.booksGenreId || "",
      reviewAverage: item.reviewAverage || 0,
      reviewCount: item.reviewCount || 0,
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("APIエラー詳細:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
