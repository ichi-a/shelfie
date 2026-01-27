import { GoogleGenerativeAI, SchemaType} from "@google/generative-ai";

/**
 * ユーザーの本棚情報を元におすすめを3つ提案してもらう関数
 */
export async function getBookRecommendations(books: any[]) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;


  if (!apiKey) {
    console.error("APIキーが見つかりません。envファイルと再起動を確認してください。");
    return "APIキーの設定エラーです。";
  }

  // 2. 関数の中でインスタンス化する（これによってTop-levelでのエラーを防ぐ）
  const genAI = new GoogleGenerativeAI(apiKey);

  // モデルの初期化 (Gemini 2.5 Flash)
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT, // 全体は1つのオブジェクト
        properties: {
          // 総括コメントを1つ定義
          librarianSummary: { type: SchemaType.STRING },
          // 本のリストを配列として定義
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

  const bookshelfData = books.map(b =>
    `- タイトル: ${b.title}, 著者: ${b.author}, 評価: ${b.score}/5, コメント: ${b.comment}`
  ).join('\n');

  const prompt = `
    あなたはプロの書評家であり、読書コンシェルジュです。
    以下のユーザーの本棚（読んだ本のリスト）を分析して、このユーザーの好みや傾向を特定してください。
    その上で、ユーザーの好みに基づいて、ユーザーがまだ読んだことのない、次に読むべきおすすめの本を具体的に1つ提案してください。
    その本をおすすめする理由も説明してください。
    さらに次点でおすすめの本を二冊提案してください。
    その二冊を進める理由も短く簡易的に説明してください。


    【ユーザーの本棚データ】
    ${bookshelfData}

    【出力ルール】
    1. 各提案には「タイトル」「著者」「なぜおすすめか（理由）」を含めること。
    2. 提案する本3つのうち1つの提案は、少しだけ異なる角度（ジャンルや作家）から選ぶこと。
    3. 日本語で親しみやすい口調で回答してください。
    4. 出力は500文字以内に収めてください。
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}
