

export async function SearchBooksR (query) {

  const queryQ = encodeURIComponent(query)

    const res = await fetch(`https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=${process.env.NEXT_PUBLIC_RAKUTEN_API_KEY}&keyword=${queryQ}&hits=10&booksGenreId=001&sort=sales&formatVersion=2`)
    if(!res.ok) {
      throw new Error("本が見つかりません")
    }
    return res.json()
}
export async function SearchBooksRgemini (title, author) {

  const titleQ = encodeURIComponent(title)
  const authorQ = encodeURIComponent(author)

    const res = await fetch(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=${process.env.NEXT_PUBLIC_RAKUTEN_API_KEY}&title=${titleQ}&author=${authorQ}&hits=1&formatVersion=2`)
    if(!res.ok) {
      throw new Error("本が見つかりません")
    }
    return res.json()
}
