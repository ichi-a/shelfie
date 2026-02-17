// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // ガードしたいパスのリスト
  const protectedPaths = ["/myShelf", "/search"];

  // 現在のパスがガード対象リストに含まれているかチェック
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    if (!session) {
      // Cookieがない（未ログイン）ならトップページへ強制送還(しない)
      console.log(`🚫 Auth Required: Redirecting from ${pathname} to /`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// 適用範囲を絞るための設定（これを入れると効率的です）
export const config = {
  matcher: ["/api/gemini/:path*"],
};
