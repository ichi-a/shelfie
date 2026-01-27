import { GeminiInput } from "@/components/GeminiInput";
import { SearchBooks } from "@/components/SearchBooks ";
import WallShelfBooks from "@/components/ui/Shelf";
import { SearchBooksR } from "@/lib/searchBooksRakuten";



export default async function Home() {

  const data = await SearchBooks("伊坂幸太郎")
  if(!data) return
  console.log(data)
  const authorR = "村上春樹"
  const titleR = "ノルウェイの森"

  const rrr = await SearchBooksR(titleR, authorR)
  console.log(rrr)

  return (
    <div >
      <ul>
        {data.items?.map((book) => (
          <li key={book.id}>
            <p>{book.id}</p>
            <p>{book.volumeInfo.title}</p>
            {book.volumeInfo.authors?.map((v) => (
              <p key={v}>{v}</p>
            ))}
            <img src={book.volumeInfo?.imageLinks?.thumbnail} alt=""
            />
          </li>
        ))}
      </ul>
      <WallShelfBooks data={data} />
      <p className="w-full mx-auto text-center text-gray-500">{rrr.hits}件ヒットしました</p>
      <div className="flex justify-center items-center w-full mx-auto text-center my-2">
        {rrr.Items.map(bookR => (
        <div key={bookR.isbn} className="text-center mx-auto">
          <p>{bookR.title}</p>
          <p>{bookR.author}</p>
          <img src={bookR.mediumImageUrl} alt={bookR.title} className="mx-auto"/>
        </div>
        ))}
      </div>


      <GeminiInput />

    </div>
  );
}
