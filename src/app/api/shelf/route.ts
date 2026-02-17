import { adminAuth, adminDb } from "@/lib/firebaseAdmin"; // adminDbをインポート
import * as admin from "firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//汎用
async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await adminAuth.verifySessionCookie(session, true);
  } catch (error) {
    console.error("認証エラー", error);
    return null;
  }
}

//本の追加
export async function POST(req: Request) {
  try {
    const decodedClaims = await getAuthenticatedUser();
    if (!decodedClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decodedClaims.uid;

    const body = await req.json();
    console.log("RECEIVE_BODY:", body);
    const { item, score, comment, status } = body;

    // item.isbn が存在するかチェック
    if (!item?.isbn) {
      console.error("VALIDATION_FAILED: item or isbn is missing");
      return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
    }

    // ★ adminDb を使う
    const shelfRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("myShelf")
      .doc(item.isbn);

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//本の一覧
export async function GET() {
  try {
    const decodedClaims = await getAuthenticatedUser();
    if (!decodedClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decodedClaims.uid;
    const shelfref = adminDb
      .collection("users")
      .doc(userId)
      .collection("myShelf");

    const snapshot = await shelfref.orderBy("addedAt", "desc").get();
    const books = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json(books);
  } catch (error) {
    console.error("GETエラー", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//本の編集、更新
export async function PATCH(req: Request) {
  try {
    const decodedClaims = await getAuthenticatedUser();
    if (!decodedClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isbn, ...updates } = await req.json();
    const userId = decodedClaims.uid;

    const bookRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("myShelf")
      .doc(isbn);

    await bookRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("PATCHエラー", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//削除
export async function DELETE(req: Request) {
  try {
    const decodedClaims = await getAuthenticatedUser();
    if (!decodedClaims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isbn } = await req.json();
    const userId = decodedClaims.uid;

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("myShelf")
      .doc(isbn)
      .delete();

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("DELETEエラー:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
