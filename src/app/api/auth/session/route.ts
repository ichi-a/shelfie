import { adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5日間

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    const cookieStore = await cookies();

    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true, // JavaScriptからアクセス不可にする
      secure: true, // HTTPS必須
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.set("session", "", {
    path: "/",
    maxAge: 0, // 即座に無効化
    httpOnly: true,
    secure: true, // 本番環境（HTTPS）用
    sameSite: "lax",
  });
  return NextResponse.json({ status: "success" });
}
