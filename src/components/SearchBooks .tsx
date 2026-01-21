

export async function SearchBooks (query) {


    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${query}+OR+inauthor:${query}&maxResults=10&startIndex=0&key=${process.env.NEXT_PUBLIC_BOOKS_API_KEY}
  `)
    if(!res.ok) {
      throw new Error("本が見つかりません")
    }
    return res.json()


}
