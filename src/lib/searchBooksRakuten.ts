

export async function SearchBooksR (title, author) {

  const titleQ = encodeURIComponent(title)
  const authorQ = encodeURIComponent(author)

    const res = await fetch(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=${process.env.NEXT_PUBLIC_RAKUTEN_API_KEY}&title=${titleQ}&author=${authorQ}&hits=10&formatVersion=2`)
    if(!res.ok) {
      throw new Error("本が見つかりません")
    }
    return res.json()
}
