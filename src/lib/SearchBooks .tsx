export async function SearchBooks(query: string) {
  const res =
    await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=4&startIndex=0&key=${process.env.NEXT_PUBLIC_BOOKS_API_KEY}
  `);
  if (!res.ok) {
    throw new Error("本が見つかりません");
  }
  return res.json();
}
