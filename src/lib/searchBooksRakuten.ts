export async function SearchBooksR(query: string) {
  const queryQ = encodeURIComponent(query);

  // 自分のAPI (/api/search) にリクエスト。元のパラメータはそのまま維持。
  const res = await fetch(
    `/api/search?type=Total&keyword=${queryQ}&hits=14&booksGenreId=001004&sort=sales&formatVersion=2`
  );

  if (!res.ok) throw new Error("本が見つかりません");
  return res.json();
}

export async function SearchBooksRgemini(title: string, author: string) {
  const titleQ = encodeURIComponent(title);
  const authorQ = encodeURIComponent(author);

  // 自分のAPI (/api/search) にリクエスト。元のパラメータはそのまま維持。
  const res = await fetch(
    `/api/search?type=Book&title=${titleQ}&author=${authorQ}&hits=1&formatVersion=2`
  );

  if (!res.ok) throw new Error("本が見つかりません");
  return res.json();
}
