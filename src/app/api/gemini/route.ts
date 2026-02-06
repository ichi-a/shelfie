import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { Book } from "@/types/book";

export async function POST(req: Request) {
  try {
    const { books } = await req.json();

    // 鍵はサーバー側で管理（NEXT_PUBLICなし）
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key error" }, { status: 500 });
    }

    // --- ここから下は、あなたが提示した元のコードをそのまま移植 ---
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            librarianSummary: { type: SchemaType.STRING },
            recommendedBooks: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  bookTitle: { type: SchemaType.STRING },
                  author: { type: SchemaType.STRING },
                },
                required: ["bookTitle", "author"]
              }
            }
          },
          required: ["librarianSummary", "recommendedBooks"]
        }
      }
    });

    const bookshelfData = books.map((b: Book) => {
  const statusLabel = b.status === "readed" ? "【読了】" : "【積読/読みたい】";

  // b.score が undefined や null なら 0 を使う
  const scoreValue = b.score ?? 0;
  const scoreText = scoreValue > 0 ? `${scoreValue}/5` : "未評価";

  return `${statusLabel}
- 書名: ${b.title}
- 著者: ${b.author}
- 満足度: ${scoreText}
- 読書メモ: ${b.comment || "（コメントなし）"}`;
}).join('\n\n---\n\n');


    const prompt = `
あなたはユーザーの本棚を分析する「AI司書」です。
以下の【本棚データ】を元に、ユーザーの好みを分析し、ユーザーの本棚には無い、最高の一冊を提案してください。

【本棚データ】
${bookshelfData}

【出力形式（厳守）】
1. ユーザーの読書傾向：(150文字程度で分析)
2. 次に読むべき一冊：『タイトル』/ 著者名
3. おすすめする理由：(100文字程度で解説)

【制約事項】
・提案は日本国内で流通している実在の本1冊のみ。
・日本国内で有名な本を提案してください。
・タイトルと著者名は正確に、余計な装飾（副題など）は省くこと。
・親しみやすく、かつ知的な口調で。
・全体で400文字以内。
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // --- ここまで ---

    return NextResponse.json(JSON.parse(response.text()));
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
