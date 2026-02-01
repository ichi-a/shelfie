import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // どのAPIを使うか（Total or Book）を判定
  const type = searchParams.get("type");
  const apiKey = process.env.RAKUTEN_API_KEY;

  if (!apiKey) return NextResponse.json({ error: "API Key Error" }, { status: 500 });

  // 楽天APIのベースURLを判定
  const baseUrl = type === "Total"
    ? "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404"
    : "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";

  // 今あるパラメータをそのまま引き継ぐ
  const newParams = new URLSearchParams(searchParams);
  newParams.set("applicationId", apiKey);
  newParams.delete("type"); // 内部用パラメータなので削除

  try {
    const res = await fetch(`${baseUrl}?${newParams.toString()}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Network Error" }, { status: 500 });
  }
}
